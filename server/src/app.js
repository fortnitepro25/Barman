const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = require("./db");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(
  session({
    name: "barman.sid",
    secret:
      process.env.SESSION_SECRET || "change-this-local-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

function requireAuth(req, res, next) {
  if (!req.session.userId || !req.session.barId) {
    return res.status(401).json({ error: "Please log in first." });
  }

  next();
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function handleError(res, error) {
  console.error(error);

  if (error.code === "P2002") {
    return res.status(409).json({ error: "That value is already in use." });
  }

  if (error.code === "P2025") {
    return res.status(404).json({ error: "Item not found." });
  }

  return res.status(500).json({ error: "Something went wrong on the server." });
}

// HEALTH

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", application: "BARMAN" });
});

app.get("/api/health/database", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    handleError(res, error);
  }
});

// AUTHENTICATION

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, barName, setupCode } = req.body;

    if (!process.env.SETUP_CODE) {
      return res.status(503).json({
        error:
          "Registration is disabled. Configure SETUP_CODE in server/.env first.",
      });
    }

    if (setupCode !== process.env.SETUP_CODE) {
      return res.status(403).json({ error: "Invalid setup code." });
    }

    if (!name || !email || !password || !barName) {
      return res.status(400).json({ error: "Please fill in every field." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters.",
      });
    }

    const slug = makeSlug(barName);

    if (!slug) {
      return res.status(400).json({ error: "Please enter a valid bar name." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        bar: {
          create: {
            name: barName.trim(),
            slug,
          },
        },
      },
      include: { bar: true },
    });

    req.session.userId = user.id;
    req.session.barId = user.bar.id;

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      bar: user.bar,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { bar: true },
    });

    if (!user || !user.bar) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    req.session.userId = user.id;
    req.session.barId = user.bar.id;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      bar: user.bar,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      include: { bar: true },
    });

    if (!user || !user.bar) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session is no longer valid." });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      bar: user.bar,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: "Could not log out." });
    }

    res.clearCookie("barman.sid");
    res.json({ message: "Logged out." });
  });
});

// PUBLIC BAR WEBSITE

app.get("/api/public/:slug", async (req, res) => {
  try {
    const bar = await prisma.bar.findUnique({
      where: { slug: req.params.slug },
      select: {
        name: true,
        slug: true,
        description: true,
        address: true,
        accentColor: true,
        backgroundColor: true,
        logoUrl: true,
        menuItems: {
          where: { available: true },
          orderBy: { category: "asc" },
        },
        events: {
          where: { published: true },
          orderBy: { startsAt: "asc" },
        },
      },
    });

    if (!bar) {
      return res.status(404).json({ error: "Bar not found." });
    }

    res.json({ bar });
  } catch (error) {
    handleError(res, error);
  }
});

// PUBLIC RESERVATION FORM

app.post("/api/public/:slug/reservations", async (req, res) => {
  try {
    const { customerName, customerEmail, reservationAt, guestCount, notes } =
      req.body;

    if (!customerName || !customerEmail || !reservationAt || !guestCount) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    if (!validDate(reservationAt)) {
      return res
        .status(400)
        .json({ error: "Please choose a valid reservation date." });
    }

    const guests = Number(guestCount);

    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      return res
        .status(400)
        .json({ error: "Guest count must be between 1 and 20." });
    }

    const bar = await prisma.bar.findUnique({
      where: { slug: req.params.slug },
    });

    if (!bar) {
      return res.status(404).json({ error: "Bar not found." });
    }

    const reservation = await prisma.reservation.create({
      data: {
        barId: bar.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        reservationAt: new Date(reservationAt),
        guestCount: guests,
        notes: notes || "",
      },
    });

    res.status(201).json({
      message: "Reservation request received.",
      reservation,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DASHBOARD STATISTICS
app.get("/api/dashboard", requireAuth, async (req, res) => {
  try {
    const barId = req.session.barId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      todayReservations,
      totalMenuItems,
      upcomingEvents,
    ] = await Promise.all([
      prisma.reservation.count({
        where: { barId },
      }),

      prisma.reservation.count({
        where: { barId, status: "PENDING" },
      }),

      prisma.reservation.count({
        where: { barId, status: "CONFIRMED" },
      }),

      prisma.reservation.count({
        where: {
          barId,
          reservationAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      prisma.menuItem.count({
        where: { barId },
      }),

      prisma.event.count({
        where: {
          barId,
          published: true,
          startsAt: { gte: new Date() },
        },
      }),
    ]);

    res.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      todayReservations,
      totalMenuItems,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      error: "Failed to load dashboard statistics.",
    });
  }
});

// MANAGEMENT: RESERVATIONS

const RESERVATION_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function getValidId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  return id;
}

// GET ALL RESERVATIONS
// Optional filter: /api/reservations?status=PENDING

app.get("/api/reservations", requireAuth, async (req, res) => {
  try {
    const where = {
      barId: req.session.barId,
    };

    if (req.query.status !== undefined) {
      const status = req.query.status.toUpperCase();

      if (!RESERVATION_STATUSES.includes(status)) {
        return res.status(400).json({
          error: "Invalid reservation status filter.",
        });
      }

      where.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: {
        reservationAt: "asc",
      },
    });

    res.json({
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// UPDATE RESERVATION STATUS

app.patch("/api/reservations/:id", requireAuth, async (req, res) => {
  try {
    const id = getValidId(req.params.id);
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Invalid reservation ID.",
      });
    }

    if (typeof status !== "string" || !RESERVATION_STATUSES.includes(status)) {
      return res.status(400).json({
        error: "Invalid reservation status.",
      });
    }

    const existing = await prisma.reservation.findFirst({
      where: {
        id,
        barId: req.session.barId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Reservation not found.",
      });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    res.json({
      message: "Reservation status updated.",
      reservation,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE RESERVATION

app.delete("/api/reservations/:id", requireAuth, async (req, res) => {
  try {
    const id = getValidId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid reservation ID.",
      });
    }

    // Only delete a reservation belonging to this owner's bar.
    const result = await prisma.reservation.deleteMany({
      where: {
        id,
        barId: req.session.barId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Reservation not found.",
      });
    }

    res.json({
      message: "Reservation deleted successfully.",
    });
  } catch (error) {
    handleError(res, error);
  }
});

// MANAGEMENT: MENU

app.get("/api/menu", requireAuth, async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { barId: req.session.barId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    res.json({ menuItems });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/menu", requireAuth, async (req, res) => {
  try {
    const { name, description, priceCents, category } = req.body;
    const price = Number(priceCents);

    if (!name || !Number.isInteger(price) || price < 0) {
      return res
        .status(400)
        .json({ error: "Name and a valid price are required." });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        barId: req.session.barId,
        name: name.trim(),
        description: description || "",
        priceCents: price,
        category: category || "Drinks",
      },
    });

    res.status(201).json({ menuItem });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/menu/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.menuItem.findFirst({
      where: { id, barId: req.session.barId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    const data = {};
    for (const field of ["name", "description", "category", "available"]) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    if (req.body.priceCents !== undefined) {
      const price = Number(req.body.priceCents);
      if (!Number.isInteger(price) || price < 0) {
        return res.status(400).json({ error: "Invalid price." });
      }
      data.priceCents = price;
    }

    const menuItem = await prisma.menuItem.update({ where: { id }, data });
    res.json({ menuItem });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/menu/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.menuItem.findFirst({
      where: { id, barId: req.session.barId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    await prisma.menuItem.delete({ where: { id } });
    res.json({ message: "Menu item deleted." });
  } catch (error) {
    handleError(res, error);
  }
});

// MANAGEMENT: EVENTS

app.get("/api/events", requireAuth, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { barId: req.session.barId },
      orderBy: { startsAt: "asc" },
    });

    res.json({ events });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/events", requireAuth, async (req, res) => {
  try {
    const { title, description, startsAt, imageUrl, published } = req.body;

    if (!title || !validDate(startsAt)) {
      return res
        .status(400)
        .json({ error: "Event title and valid date are required." });
    }

    const event = await prisma.event.create({
      data: {
        barId: req.session.barId,
        title: title.trim(),
        description: description || "",
        startsAt: new Date(startsAt),
        imageUrl: imageUrl || null,
        published: Boolean(published),
      },
    });

    res.status(201).json({ event });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/events/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.event.findFirst({
      where: { id, barId: req.session.barId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Event not found." });
    }

    const data = {};
    for (const field of ["title", "description", "imageUrl", "published"]) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    if (req.body.startsAt !== undefined) {
      if (!validDate(req.body.startsAt)) {
        return res.status(400).json({ error: "Invalid event date." });
      }
      data.startsAt = new Date(req.body.startsAt);
    }

    const event = await prisma.event.update({ where: { id }, data });
    res.json({ event });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/events/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.event.findFirst({
      where: { id, barId: req.session.barId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Event not found." });
    }

    await prisma.event.delete({ where: { id } });
    res.json({ message: "Event deleted." });
  } catch (error) {
    handleError(res, error);
  }
});

// MANAGEMENT: BAR SETTINGS

app.patch("/api/bar", requireAuth, async (req, res) => {
  try {
    const data = {};

    for (const field of [
      "name",
      "description",
      "address",
      "accentColor",
      "backgroundColor",
      "logoUrl",
    ]) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    if (data.name !== undefined && !data.name.trim()) {
      return res.status(400).json({ error: "Bar name cannot be empty." });
    }

    const bar = await prisma.bar.update({
      where: { id: req.session.barId },
      data,
    });

    res.json({ bar });
  } catch (error) {
    handleError(res, error);
  }
});

// SERVER

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BARMAN API running on port ${PORT}`);
});
