
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

const ASSETS = "/assets/";

/* ==========================================
   CONTACT DETAILS
========================================== */

const CONTACT_DETAILS = {
  phones: ["+919626261331", "+919442053705"],
  phone: "+919626261331",
  whatsapp: "919626261331",
  address: "G9R6+C37, Karim Saibu St, Bargur, Tamil Nadu 635104",
  mapsUrl:
    "https://www.google.com/maps/place/Bargur+Hotel/@12.5406494,78.3595106,17z/data=!3m1!4b1!4m6!3m5!1s0x3bac4bf01b257af5:0x9bbfb71b4d5d7537!8m2!3d12.5406442!4d78.3620855!16s%2Fg%2F11h_br2msd?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D",
  instagramUrl: "",
  facebookUrl: "",
};

/* ==========================================
   WHATSAPP LINK
========================================== */

const getWhatsAppLink = () => {
  return `https://wa.me/${CONTACT_DETAILS.whatsapp}`;
};

/* ==========================================
   FOOD CONTENT
========================================== */

const FOOD_CONTENT = {
  veg: {
    label: "VEG",
    title: "Vegetarian",
    shortTitle: "VEG",
    subtitle: "The art of fresh flavour",
    description:
      "Fresh ingredients. Carefully balanced spices. Traditional vegetarian cooking, prepared with care.",
    bannerTitle: "A FRESH TAKE ON TRADITION",
    bannerDescription:
      "Discover vibrant vegetarian flavours and warm hospitality at Hotel Bargur.",
    desktopVideo: "veg-desktop.mp4",
    mobileVideo: "veg-mobile.mp4",
    badge: "100% VEG",
    colour: "veg",
    preparation: [
      {
        title: "Fresh Ingredients",
        description:
          "Fresh vegetables, herbs, and ingredients are carefully selected.",
      },
      {
        title: "Balanced Spices",
        description:
          "Traditional spices bring warmth, aroma, and depth to every dish.",
      },
      {
        title: "Prepared with Care",
        description:
          "Ingredients are cooked using suitable traditional methods.",
      },
      {
        title: "Served with Tradition",
        description:
          "A comforting vegetarian meal, served with warm hospitality.",
      },
    ],
  },

  nonveg: {
    label: "NON-VEG",
    title: "Non-Vegetarian",
    shortTitle: "NON-VEG",
    subtitle: "The art of rich flavour",
    description:
      "Aromatic spices, rich ingredients, and traditional cooking create memorable non-vegetarian flavours.",
    bannerTitle: "BIG FLAVOUR. BIG MEMORIES.",
    bannerDescription:
      "Discover satisfying favourites and the warm hospitality of Hotel Bargur.",
    desktopVideo: "biryani-desktop.mp4",
    mobileVideo: "biryani-mobile.mp4",
    badge: "NON VEG",
    colour: "nonveg",
    preparation: [
      {
        title: "Ingredient Preparation",
        description:
          "Ingredients, herbs, and spices are carefully prepared for cooking.",
      },
      {
        title: "Building Flavour",
        description:
          "Aromatic spices and seasonings create a rich flavour base.",
      },
      {
        title: "Cooking with Care",
        description:
          "Ingredients are cooked thoroughly using suitable methods.",
      },
      {
        title: "Served with Tradition",
        description:
          "The finished dish is served warm with traditional accompaniments.",
      },
    ],
  },
};

function getFoodTypeFromHash() {
  return window.location.hash.includes("nonveg") ? "nonveg" : "veg";
}

/* ==========================================
   MAIN APP
========================================== */

export default function App() {
  const [page, setPage] = useState(
    window.location.hash === "#preparation" ? "preparation" : "home"
  );

  const [foodType, setFoodType] = useState(getFoodTypeFromHash);
  const [teleporting, setTeleporting] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);

  const videoRef = useRef(null);
  const teleportTimerRef = useRef(null);

  const food = FOOD_CONTENT[foodType];

  /* LOADING SCREEN */

  useEffect(() => {
    let fadeTimer;
    let removeTimer;
    let fallbackTimer;
    let finished = false;

    const minimumDisplayTime = 4000;
    const startTime = Date.now();

    const finishLoading = () => {
      if (finished) return;
      finished = true;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      window.clearTimeout(fallbackTimer);

      fadeTimer = window.setTimeout(() => {
        setLoaderFading(true);

        removeTimer = window.setTimeout(() => {
          setIsLoading(false);
        }, 750);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    fallbackTimer = window.setTimeout(finishLoading, 10000);

    return () => {
      window.removeEventListener("load", finishLoading);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  /* RESPONSIVE VIEWPORT */

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);

      if (teleportTimerRef.current) {
        window.clearTimeout(teleportTimerRef.current);
      }
    };
  }, []);

  /* HASH NAVIGATION */

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === "#preparation") {
        setPage("preparation");
        setTeleporting(false);
      } else if (hash === "#food-selection") {
        setPage("selection");
        setTeleporting(false);
      } else if (hash === "#top" || hash === "" || hash === "#") {
        setPage("home");
        setTeleporting(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  /* PAGE TITLE */

  useEffect(() => {
    document.title =
      page === "preparation"
        ? `The Art of ${food.title} | Hotel Bargur`
        : page === "video"
          ? `${food.title} | Hotel Bargur`
          : "HOTEL BARGUR | Good Food, Warm Hospitality";
  }, [page, food.title]);

  /* VIDEO AUTOPLAY */

  useEffect(() => {
    if (page !== "video" || teleporting || videoFinished) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = false;
    video.volume = 0;

    video.play().catch(() => {});
  }, [page, teleporting, videoFinished, isMobile, foodType]);

  /* OPEN FOOD EXPERIENCE */

  const openFoodExperience = (type) => {
    if (teleportTimerRef.current) {
      window.clearTimeout(teleportTimerRef.current);
    }

    setFoodType(type);
    setVideoFinished(false);
    setVideoError(false);
    setTeleporting(true);
    setPage("video");

    window.history.replaceState(null, "", `#${type}`);

    teleportTimerRef.current = window.setTimeout(() => {
      setTeleporting(false);
    }, 1150);
  };

  /* GO HOME */

  const goHome = () => {
    if (teleportTimerRef.current) {
      window.clearTimeout(teleportTimerRef.current);
    }

    videoRef.current?.pause();

    setTeleporting(false);
    setVideoFinished(false);
    setVideoError(false);
    setPage("home");

    window.location.hash = "top";
  };

  /* OPEN PREPARATION */

  const openPreparation = () => {
    videoRef.current?.pause();
    setPage("preparation");
    window.location.hash = "preparation";
  };

  /* RETURN TO VIDEO */

  const returnToVideo = () => {
    setPage("video");
    window.location.hash = foodType;
  };

  /* FINISH VIDEO */

  const finishVideo = () => {
    const video = videoRef.current;

    if (!video) {
      setVideoFinished(true);
      return;
    }

    video.pause();

    if (Number.isFinite(video.duration) && video.duration > 0) {
      try {
        video.currentTime = video.duration;
      } catch {
        // Keep the current frame.
      }
    }

    setVideoFinished(true);
  };

  /* RETRY VIDEO */

  const retryVideo = () => {
    setVideoError(false);
    setVideoFinished(false);

    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.loop = false;
      videoRef.current.volume = 0;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="bargur-app">

      {/* LOADING SCREEN */}

      {isLoading && (
        <div
          className={`bargur-loader ${
            loaderFading ? "is-fading" : ""
          }`}
          aria-label="Loading Hotel Bargur"
          aria-live="polite"
        >
          <div className="rangoli rangoli-left" />
          <div className="rangoli rangoli-right" />
          <div className="rangoli rangoli-top" />
          <div className="rangoli rangoli-bottom" />

          <div className="rangoli-center">
            <span>✺</span>
            <span>❋</span>
            <span>✺</span>
          </div>

          <img
            src={`${ASSETS}hotel-bargur-loading.png`}
            alt="Hotel Bargur"
            className="bargur-loader-logo"
          />

          <span className="loader-ornament">✿</span>
          <p>GOOD FOOD · WARM HOSPITALITY</p>
        </div>
      )}

      {/* HOME PAGE */}

      {page === "home" && (
        <HomePage
          onChoose={openFoodExperience}
          onExplore={() => {
            setPage("selection");
            window.location.hash = "food-selection";
          }}
        />
      )}

      {/* SELECTION PAGE */}

      {page === "selection" && (
        <SelectionPage
          onChoose={openFoodExperience}
          onHome={goHome}
        />
      )}

      {/* VIDEO PAGE */}

      {page === "video" && (
        <section
          className={`video-fullscreen ${
            videoFinished ? "video-finished" : ""
          }`}
        >
          {!videoError && (
            <>
              <video
                key={`${foodType}-${isMobile ? "mobile" : "desktop"}`}
                ref={videoRef}
                className={`food-video ${
                  videoFinished ? "video-frozen" : ""
                }`}
                src={`${ASSETS}${
                  isMobile ? food.mobileVideo : food.desktopVideo
                }`}
                playsInline
                preload="auto"
                muted
                loop={false}
                controls={videoFinished}
                onEnded={() => setVideoFinished(true)}
                onError={() => setVideoError(true)}
                aria-label={`${food.title} food presentation`}
              />

              <div className="video-image-shade" />
              <div className="video-frame" aria-hidden="true" />

              <div className={`video-food-badge ${food.colour}`}>
                <span className="badge-top-text">HOTEL BARGUR</span>
                <span className="badge-symbol">
                  {foodType === "veg" ? "●" : "◆"}
                </span>
                <strong>{food.badge}</strong>
                <span className="badge-number">MADE WITH CARE</span>
              </div>

              <div className="video-banner video-banner-top">
                <p className="video-banner-overline">
                  HOTEL BARGUR · GOOD FOOD
                </p>

                <h2 className="video-banner-heading">
                  BUILT FOR <span>FLAVOUR.</span>
                </h2>

                <div className="video-banner-topline">
                  <span>TRADITIONAL TASTE</span>
                  <span>FRESHLY PREPARED</span>
                  <span>MADE WITH CARE</span>
                </div>
              </div>

              <div className="video-banner video-banner-bottom">
                <div>
                  <h3>{food.bannerTitle}</h3>
                  <p>{food.bannerDescription}</p>
                </div>
              </div>

              {!videoFinished && (
                <button
                  className="video-skip-button"
                  onClick={finishVideo}
                  type="button"
                >
                  SKIP VIDEO ↗
                </button>
              )}

              {videoFinished && (
                <aside className="final-details-panel">
                  <div className="details-topline">
                    <span>HOTEL BARGUR</span>
                    <span>01 / 02</span>
                  </div>

                  <div className="details-content">
                    <span className="details-ornament">✳</span>
                    <p className="details-eyebrow">
                      OUR DINING EXPERIENCE
                    </p>

                    <h2>{food.title}</h2>

                    <div className="details-divider">
                      <span />
                      <span className="divider-star">✦</span>
                      <span />
                    </div>

                    <p className="details-description">
                      {food.subtitle}.
                    </p>

                    <p className="details-message">
                      {food.description}
                    </p>

                    <button
                      className="details-home-button"
                      onClick={openPreparation}
                      type="button"
                    >
                      EXPLORE {food.label} PREPARATION
                      <span>↗</span>
                    </button>

                    <button
                      className="details-secondary-button"
                      onClick={goHome}
                      type="button"
                    >
                      HOME
                    </button>
                  </div>

                  <div className="details-footer">
                    <span>GOOD FOOD</span>
                    <span>✳</span>
                    <span>WARM HOSPITALITY</span>
                  </div>
                </aside>
              )}
            </>
          )}

          {videoError && (
            <div className="video-error">
              <p className="video-error-overline">HOTEL BARGUR</p>
              <h2>We couldn't load this video.</h2>

              <p>
                Check that{" "}
                <strong>
                  {isMobile ? food.mobileVideo : food.desktopVideo}
                </strong>{" "}
                exists in <code>public/assets</code>.
              </p>

              <div>
                <button
                  className="retry-button"
                  type="button"
                  onClick={retryVideo}
                >
                  TRY AGAIN
                </button>

                <button
                  className="back-home-button"
                  type="button"
                  onClick={goHome}
                >
                  HOME
                </button>
              </div>
            </div>
          )}

          {teleporting && <TeleportCloud />}
        </section>
      )}

      {/* PREPARATION PAGE */}

      {page === "preparation" && (
        <PreparationPage
          foodType={foodType}
          onHome={goHome}
          onBack={returnToVideo}
        />
      )}
    </div>
  );
}

/* ==========================================
   HOME PAGE
========================================== */

function HomePage({ onChoose, onExplore }) {
  return (
    <div className="home-page" id="top">

      {/* HEADER — NO EXPLORE BUTTON */}

      <header className="home-header">
        <a href="#top" className="home-brand">
          <span className="home-brand-mark">HB</span>
          <span>HOTEL BARGUR</span>
        </a>

        <span className="home-header-label">
          GOOD FOOD · WARM HOSPITALITY
        </span>
      </header>

      <main>

        {/* HERO */}

        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-eyebrow">
              WELCOME TO HOTEL BARGUR
            </p>

            <h1>
              GOOD FOOD.
              <span>GREAT</span>
              <span className="script-accent">memories.</span>
            </h1>

            <p className="home-description">
              A place for authentic flavours, traditional cooking,
              and warm hospitality.
            </p>

            <button
              className="home-primary-button"
              onClick={onExplore}
              type="button"
            >
              DISCOVER OUR FOOD <span>↗</span>
            </button>

            <div className="home-microcopy">
              <span>TRADITION</span>
              <i />
              <span>FLAVOUR</span>
              <i />
              <span>HOSPITALITY</span>
            </div>
          </div>

          <div className="home-photo-card">
            <div className="home-photo-label">
              <span>HOTEL BARGUR</span>
              <span>EST. 1996</span>
            </div>

            <img
              src={`${ASSETS}restaurant-front.png`}
              className="home-restaurant-image"
              alt="The front entrance of Hotel Bargur"
            />

            <div className="home-photo-footer">
              <span>YOUR TABLE AWAITS</span>
              <span>✳</span>
            </div>

            <div className="home-photo-stamp">
              <span>GOOD FOOD</span>
              <strong>HB</strong>
              <span>GOOD PEOPLE</span>
            </div>
          </div>
        </section>

        {/* FOOD SELECTION */}

        <section
          className="home-food-section"
          id="food-selection"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">
                MADE FOR YOUR TABLE
              </p>

              <h2>
                What's on
                <span> your mind?</span>
              </h2>
            </div>

            <p>Choose your experience.</p>
          </div>

          <div className="home-food-grid">

            <button
              className="home-food-card home-veg-card"
              onClick={() => onChoose("veg")}
              type="button"
            >
              <span className="food-card-top">
                <span>01 / VEGETARIAN</span>
                <span className="food-card-arrow">↗</span>
              </span>

              <span className="home-food-title">VEG.</span>

              <span className="food-card-bottom">
                FRESH FLAVOURS · MADE WITH CARE
              </span>
            </button>

            <button
              className="home-food-card home-nonveg-card"
              onClick={() => onChoose("nonveg")}
              type="button"
            >
              <span className="food-card-top">
                <span>02 / NON-VEGETARIAN</span>
                <span className="food-card-arrow">↗</span>
              </span>

              <span className="home-food-title">NON-VEG.</span>

              <span className="food-card-bottom">
                RICH FLAVOURS · TIME-HONOURED TASTE
              </span>
            </button>

          </div>
        </section>

        <Since1996Section />
        <ContactSection />

      </main>

      {/* CLASSIC FOOTER — HOME PAGE ONLY */}

      <ClassicFooter
        onHome={onExplore}
        onBack={onExplore}
      />

      {/* DEVELOPER FILM REEL — BELOW FOOTER */}

      <FilmReelStrip />

    </div>
  );
}

/* ==========================================
   SERVING SINCE 1996
========================================== */

function Since1996Section() {
  return (
    <section className="since-section">
      <div className="since-heading">
        <p className="since-eyebrow">
          A LEGACY OF GREAT TASTE
        </p>

        <h2>
          Serving Since <span>1996</span>
        </h2>

        <p className="since-subtitle">
          Three decades of flavour, tradition and memorable moments.
        </p>
      </div>

      <div className="shop-video-wrapper">
        <video
          className="shop-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`${ASSETS}restaurant-front.png`}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Hotel Bargur restaurant video"
        >
          <source
            src={`${ASSETS}hotel-bargur-shop.mp4`}
            type="video/mp4"
          />
          Your browser does not support HTML video.
        </video>

        <div className="shop-video-caption">
          <span>HOTEL BARGUR</span>
          <span>EST. 1996</span>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   CONTACT SECTION
========================================== */

function ContactSection() {
  const phoneLink = `tel:${CONTACT_DETAILS.phone}`;
  const whatsappLink = getWhatsAppLink();

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">

        <div className="contact-heading">
          <p className="contact-eyebrow">HOTEL BARGUR</p>
          <h2>Visit Us. Savour the Tradition</h2>
        </div>

        <div className="contact-grid">

          <article className="contact-card">
            <a
              className="contact-icon"
              href={phoneLink}
              aria-label="Call Hotel Bargur"
            >
              <span aria-hidden="true">☎</span>
            </a>

            <h3>CALL US</h3>
            <a href={phoneLink}>{CONTACT_DETAILS.phone}</a>
          </article>

          <article className="contact-card">
            <a
              className="contact-icon"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Hotel Bargur on WhatsApp"
            >
              <span aria-hidden="true">✉</span>
            </a>

            <h3>WHATSAPP</h3>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us on WhatsApp
            </a>
          </article>

          <article className="contact-card">
            <a
              className="contact-icon"
              href={CONTACT_DETAILS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Hotel Bargur location in Google Maps"
            >
              <span aria-hidden="true">●</span>
            </a>

            <h3>OUR LOCATION</h3>

            <a
              href={CONTACT_DETAILS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTACT_DETAILS.address}
            </a>
          </article>

        </div>

        <div className="contact-socials">
          <span>FOLLOW OUR JOURNEY</span>

          {CONTACT_DETAILS.instagramUrl && (
            <a
              href={CONTACT_DETAILS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              INSTAGRAM ↗
            </a>
          )}

          {CONTACT_DETAILS.facebookUrl && (
            <a
              href={CONTACT_DETAILS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              FACEBOOK ↗
            </a>
          )}
        </div>

      </div>
    </section>
  );
}

/* ==========================================
   SELECTION PAGE
========================================== */

function SelectionPage({ onChoose, onHome }) {
  return (
    <main className="selection-page">

      <header className="selection-header">
        <button
          className="home-brand"
          onClick={onHome}
          type="button"
        >
          <span className="home-brand-mark">HB</span>
          HOTEL BARGUR
        </button>

        <span className="home-header-label">
          CHOOSE YOUR EXPERIENCE
        </span>

        <button
          className="home-nav-button"
          onClick={onHome}
          type="button"
        >
          HOME ↗
        </button>
      </header>

      <section className="selection-content">
        <p className="home-eyebrow">
          OUR FOOD · OUR TRADITION
        </p>

        <h1>
          Discover
          <span className="script-accent"> your flavour.</span>
        </h1>

        <p className="selection-description">
          Two traditions. One place for good food.
        </p>

        <div className="selection-choices">

          <button
            className="selection-choice veg-choice"
            onClick={() => onChoose("veg")}
            type="button"
          >
            <span>01 · VEGETARIAN</span>
            <strong>VEG</strong>
            <span>
              FRESH AND TRADITIONAL <b>↗</b>
            </span>
          </button>

          <button
            className="selection-choice nonveg-choice"
            onClick={() => onChoose("nonveg")}
            type="button"
          >
            <span>02 · NON-VEGETARIAN</span>
            <strong>NON-VEG</strong>
            <span>
              RICH AND HEARTY <b>↗</b>
            </span>
          </button>

        </div>
      </section>
    </main>
  );
}

/* ==========================================
   PREPARATION PAGE
   DISHES FIRST — PREPARATION BELOW
========================================== */

function PreparationPage({ foodType, onHome, onBack }) {
  const food = FOOD_CONTENT[foodType];

  return (
    <section className={`prep-page prep-${foodType}`}>

      <header className="prep-topbar">
        <button
          className="prep-brand"
          onClick={onHome}
          type="button"
        >
          <span className="prep-brand-mark">HB</span>
          HOTEL BARGUR
        </button>

        <span className="prep-top-label">
          GOOD FOOD · OUR TRADITION
        </span>

        <button
          className="prep-back-button"
          onClick={onHome}
          type="button"
        >
          ← HOME
        </button>
      </header>

      {/* DISH CAROUSEL AT THE TOP */}

      <DishCarousel foodType={foodType} />

      {/* PREPARATION BELOW */}

      <main className="prep-one-screen">

        <div className="prep-compact-copy">
          <p className="prep-eyebrow">
            HOTEL BARGUR · MADE WITH CARE
          </p>

          <h1>
            {food.shortTitle}

            <span>
              {foodType === "veg"
                ? "The art of fresh flavour"
                : "The art of rich flavour"}
            </span>
          </h1>

          <p className="prep-intro">
            {foodType === "veg"
              ? "Fresh ingredients. Carefully balanced spices. Traditional vegetarian cooking."
              : "Aromatic spices. Rich ingredients. Traditional cooking with character."}
          </p>

          <div className={`prep-compact-stamp ${foodType}`}>
            <strong>✳</strong>
            {food.badge}
            <strong>✳</strong>
          </div>

          <span className="prep-orbit-note orbit-one">
            AUTHENTIC PREPARATION
          </span>

          <span className="prep-orbit-note orbit-two">
            TRADITIONAL SPICES
          </span>

          <span className="prep-orbit-note orbit-three">
            MADE WITH CARE
          </span>
        </div>

        <div className="prep-compact-process">
          <p className="prep-eyebrow">OUR KITCHEN</p>

          <h2 className="prep-process-heading">
            From preparation to plate
          </h2>

          {food.preparation.map((step, index) => (
            <div
              className="prep-compact-step"
              key={step.title}
            >
              <span className="prep-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}

          <p className="prep-compact-note">
            TRADITION <span>✳</span> FLAVOUR <span>✳</span> HOSPITALITY
          </p>
        </div>

      </main>

    </section>
  );
}

/* ==========================================
   DISH CAROUSEL DATA
========================================== */

const DISHES = {
  veg: [
    {
      name: "South Indian Meals",
      detail: "A comforting traditional thali",
      image: "/assets/dishes/veg-meals.jpg",
      tag: "HOUSE FAVOURITE",
    },
    {
      name: "Paneer Masala",
      detail: "Rich, gently spiced and satisfying",
      image: "/assets/dishes/paneer-masala.jpg",
      tag: "RICH & CREAMY",
    },
    {
      name: "Veg Biryani",
      detail: "Fragrant rice with aromatic spices",
      image: "/assets/dishes/veg-biryani.jpg",
      tag: "AROMATIC",
    },
    {
      name: "Ghee Roast Dosa",
      detail: "Golden, crisp and freshly prepared",
      image: "/assets/dishes/ghee-roast-dosa.jpg",
      tag: "CRISP & GOLDEN",
    },
    {
      name: "Mushroom Pepper Fry",
      detail: "A bold blend of pepper and spice",
      image: "/assets/dishes/mushroom-pepper-fry.jpg",
      tag: "CHEF'S PICK",
    },
    {
      name: "Idli",
      detail: "Soft, fluffy and freshly steamed",
      image: "/assets/dishes/idli.jpg",
      tag: "TRADITIONAL FAVOURITE",
    },
    {
      name: "Vadai",
      detail: "Crispy outside, soft inside",
      image: "/assets/dishes/vadai.jpg",
      tag: "CRISPY & GOLDEN",
    },
    {
      name: "Pongal",
      detail: "A comforting South Indian classic",
      image: "/assets/dishes/pongal.jpg",
      tag: "COMFORT FOOD",
    },
    {
      name: "Poori",
      detail: "Golden, puffed and freshly prepared",
      image: "/assets/dishes/poori.jpg",
      tag: "GOLDEN & FLUFFY",
    },
    {
      name: "Kichadi",
      detail: "A deliciously comforting breakfast",
      image: "/assets/dishes/kichadi.jpg",
      tag: "SOUTH INDIAN FAVOURITE",
    },
    {
      name: "Masala Dosa",
      detail: "Golden dosa with a spiced potato filling",
      image: "/assets/dishes/masala-dosa.jpg",
      tag: "HOUSE FAVOURITE",
    },
    {
      name: "Ghee Roast",
      detail: "Crispy dosa with rich ghee flavour",
      image: "/assets/dishes/ghee-roast.jpg",
      tag: "CRISP & GOLDEN",
    },
    {
      name: "Ghee Masala Dosa",
      detail: "A classic masala dosa with ghee",
      image: "/assets/dishes/ghee-masala-dosa.jpg",
      tag: "RICH & FLAVOURFUL",
    },
    {
      name: "Onion Roast",
      detail: "Crispy roast topped with onion",
      image: "/assets/dishes/onion-roast.jpg",
      tag: "FRESHLY PREPARED",
    },
    {
      name: "Onion Uthappam",
      detail: "Soft uthappam topped with fresh onion",
      image: "/assets/dishes/onion-uthappam.jpg",
      tag: "TRADITIONAL FAVOURITE",
    },
    {
      name: "Pepper Roast",
      detail: "A crisp roast with a peppery touch",
      image: "/assets/dishes/pepper-roast.jpg",
      tag: "BOLD & FLAVOURFUL",
    },
    {
      name: "Rava Dosa",
      detail: "Thin, crispy and delicately textured",
      image: "/assets/dishes/rava-dosa.jpg",
      tag: "CRISPY CLASSIC",
    },
    {
      name: "Rava Onion",
      detail: "Crispy rava dosa with onion",
      image: "/assets/dishes/rava-onion.jpg",
      tag: "FRESH & CRISPY",
    },
    {
      name: "Plain Dosa",
      detail: "A timeless South Indian classic",
      image: "/assets/dishes/plain-dosa.jpg",
      tag: "CLASSIC FAVOURITE",
    },
    {
      name: "Plain Uthappam",
      detail: "Soft and thick traditional uthappam",
      image: "/assets/dishes/plain-uthappam.jpg",
      tag: "SOFT & DELICIOUS",
    },
    {
      name: "Parotta",
      detail: "Flaky, layered and freshly prepared",
      image: "/assets/dishes/parotta.jpg",
      tag: "FRESHLY MADE",
    },
    {
      name: "Chapathi",
      detail: "Soft and freshly prepared",
      image: "/assets/dishes/chapathi.jpg",
      tag: "EVERYDAY FAVOURITE",
    },
  ],

  nonveg: [
    {
      name: "Chicken Biryani",
      detail: "Fragrant rice layered with rich flavour",
      image: "/assets/dishes/chicken-biryani.jpg",
      tag: "HOUSE FAVOURITE",
    },
    {
      name: "Chicken 65",
      detail: "A crisp, spicy classic",
      image: "/assets/dishes/chicken-65.jpg",
      tag: "CRISPY & SPICY",
    },
    {
      name: "Mutton Biryani",
      detail: "A hearty traditional favourite",
      image: "/assets/dishes/mutton-biryani.jpg",
      tag: "SIGNATURE",
    },
    {
      name: "Pepper Chicken",
      detail: "Bold pepper with aromatic spices",
      image: "/assets/dishes/pepper-chicken.jpg",
      tag: "CHEF'S PICK",
    },
    {
      name: "Fish Fry",
      detail: "Golden-fried with a coastal spice blend",
      image: "/assets/dishes/fish-fry.jpg",
      tag: "GOLDEN & CRISP",
    },
    {
      name: "Egg Roast",
      detail: "Eggs cooked with aromatic spices",
      image: "/assets/dishes/egg-roast.jpg",
      tag: "SPICY & FLAVOURFUL",
    },
    {
      name: "Egg Dosa",
      detail: "A delicious dosa topped with egg",
      image: "/assets/dishes/egg-dosa.jpg",
      tag: "SOUTH INDIAN FAVOURITE",
    },
    {
      name: "Kuska",
      detail: "Aromatic biryani rice, full of flavour",
      image: "/assets/dishes/kuska.jpg",
      tag: "AROMATIC CLASSIC",
    },
    {
      name: "Mutton Fry",
      detail: "Mutton prepared with traditional spices",
      image: "/assets/dishes/mutton-fry.jpg",
      tag: "TRADITIONAL SPECIAL",
    },
    {
      name: "Mutton Masala",
      detail: "Rich mutton masala with aromatic spices",
      image: "/assets/dishes/mutton-masala.jpg",
      tag: "RICH & SPICY",
    },
    {
      name: "Chicken Fry",
      detail: "Chicken cooked with a flavourful spice blend",
      image: "/assets/dishes/chicken-fry.jpg",
      tag: "CRISPY & SPICY",
    },
    {
      name: "Chicken Masala",
      detail: "Traditional chicken masala preparation",
      image: "/assets/dishes/chicken-masala.jpg",
      tag: "RICH & FLAVOURFUL",
    },
    {
      name: "Kothu Parotta",
      detail: "Chopped parotta tossed with spices",
      image: "/assets/dishes/kothu-parotta.jpg",
      tag: "STREET FOOD FAVOURITE",
    },
    {
      name: "Egg Parotta",
      detail: "Layered parotta prepared with egg",
      image: "/assets/dishes/egg-parotta.jpg",
      tag: "FRESHLY PREPARED",
    },
    {
      name: "Omelette",
      detail: "A simple, freshly prepared classic",
      image: "/assets/dishes/omelette.jpg",
      tag: "CLASSIC FAVOURITE",
    },
  ],
};

/* ==========================================
   DISH CAROUSEL COMPONENT
========================================== */

function DishCarousel({ foodType }) {
  const dishes = DISHES[foodType];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [foodType]);

  const goTo = (index) => {
    setActiveIndex((index + dishes.length) % dishes.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const delta =
      event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }

    touchStartX.current = null;
  };

  return (
    <section className={`dish-showcase dish-showcase-${foodType}`}>

      <div className="dish-showcase-heading">
        <div>
          <p className="dish-kicker">
            A TASTE OF HOTEL BARGUR
          </p>

          <h2>
            Made to be <em>remembered.</em>
          </h2>
        </div>

        <p className="dish-showcase-intro">
          Explore some of our kitchen favourites, prepared
          with care and served with warmth.
        </p>
      </div>

      <div
        className="liquid-carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="liquid-carousel-track">

          {dishes.map((dish, index) => {
            const offset =
              (index - activeIndex + dishes.length) % dishes.length;

            const position =
              offset > dishes.length / 2
                ? offset - dishes.length
                : offset;

            return (
              <button
                className={`liquid-dish-card ${
                  position === 0 ? "is-active" : ""
                } ${
                  Math.abs(position) > 1 ? "is-hidden" : ""
                }`}
                key={dish.name}
                type="button"
                style={{
                  transform: `translate(calc(-50% + ${
                    position * 78
                  }%), -50%) scale(${
                    position === 0 ? 1 : 0.87
                  })`,
                  zIndex: 8 - Math.abs(position),
                  opacity:
                    Math.abs(position) > 1
                      ? 0
                      : position === 0
                        ? 1
                        : 0.68,
                }}
                onClick={() => goTo(index)}
                aria-label={`Show ${dish.name}`}
                aria-current={
                  position === 0 ? "true" : undefined
                }
              >
                <div className="liquid-dish-image-wrap">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0";
                    }}
                  />

                  <span className="dish-image-fallback">
                    HOTEL<br />BARGUR
                  </span>

                  <span className="dish-image-glass" />

                  <span className="dish-card-tag">
                    {dish.tag}
                  </span>
                </div>

                <span className="liquid-dish-caption">
                  <strong>{dish.name}</strong>
                  <small>{dish.detail}</small>
                </span>
              </button>
            );
          })}

        </div>

        <button
          className="liquid-carousel-arrow liquid-prev"
          onClick={() => goTo(activeIndex - 1)}
          type="button"
          aria-label="Previous dish"
        >
          ‹
        </button>

        <button
          className="liquid-carousel-arrow liquid-next"
          onClick={() => goTo(activeIndex + 1)}
          type="button"
          aria-label="Next dish"
        >
          ›
        </button>
      </div>

      <div className="liquid-carousel-footer">
        <span className="liquid-counter">
          {String(activeIndex + 1).padStart(2, "0")}
          {" "}
          <i>/</i>
          {" "}
          {String(dishes.length).padStart(2, "0")}
        </span>

        <div className="liquid-dots" aria-label="Choose a dish">
          {dishes.map((dish, index) => (
            <button
              key={dish.name}
              className={index === activeIndex ? "active" : ""}
              onClick={() => goTo(index)}
              type="button"
              aria-label={`Go to ${dish.name}`}
            />
          ))}
        </div>

        <span className="liquid-swipe-hint">
          SWIPE TO EXPLORE <b>↔</b>
        </span>
      </div>
    </section>
  );
}

/* ==========================================
   CLASSIC HOTEL BARGUR FOOTER
========================================== */

function ClassicFooter({ onHome, onBack }) {
  return (
    <footer className="classic-footer">

      <div className="classic-footer-main">

        <div className="classic-footer-brand">
          <div className="classic-footer-logo">HB</div>

          <h2>HOTEL BARGUR</h2>

          <span className="classic-footer-since">
            SERVING SINCE 1996
          </span>

          <p>
            Good food, warm hospitality and traditions
            that bring people together.
          </p>
        </div>

        <div className="classic-footer-column">
          <h3>EXPLORE</h3>

          <button onClick={onHome} type="button">
            Home
          </button>

          <button onClick={onBack} type="button">
            Our Food
          </button>

          <a href="#top">
            Back to Top ↑
          </a>
        </div>

        <div className="classic-footer-column">
          <h3>CONTACT</h3>

          <a href="tel:+919442053705">
            +91 94420 53705
          </a>

          <a href={`tel:${CONTACT_DETAILS.phone}`}>
            +91 96262 61331
          </a>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Us
          </a>

          <a
            href={CONTACT_DETAILS.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Find Our Location ↗
          </a>
        </div>

        <div className="classic-footer-address">
          <h3>VISIT US</h3>

          <p>
            G9R6+C37, Karim Saibu Street,
            Bargur, Tamil Nadu – 635104.
          </p>

          <span>GOOD FOOD · OUR TRADITION</span>
        </div>

      </div>

      <div className="classic-footer-divider">
        <span>✳</span>
      </div>

      <div className="classic-footer-bottom">
        <span>
          © {new Date().getFullYear()} HOTEL BARGUR.
          ALL RIGHTS RESERVED.
        </span>

        <span>
          MADE WITH TRADITION & CARE
        </span>
      </div>

    </footer>
  );
}

/* ==========================================
   DEVELOPER CREDITS — FILM REEL
========================================== */

function FilmReelStrip() {
  const credits = [
    "DESIGNED & DEVELOPED BY GOKUL S",
    "EMAIL: gokul1757gm@gmail.com",
    "INSTAGRAM: @17_s_gokul",
    "HOTEL BARGUR WEBSITE",
  ];

  return (
    <div
      className="film-reel-strip"
      aria-label="Website developer credits"
    >
      <div className="film-reel-track">

        {[0, 1].map((copy) => (
          <div className="film-reel-content" key={copy}>
            {credits.map((credit, index) => (
              <span className="film-reel-item" key={index}>
                <span className="film-reel-star">⚡   </span>
                {credit}
              </span>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}

/* ==========================================
   TELEPORT CLOUD ANIMATION
========================================== */

function TeleportCloud() {
  return (
    <div className="teleport-overlay" aria-hidden="true">
      <div className="cloud-backdrop" />
      <div className="cloud-cloud cloud-one" />
      <div className="cloud-cloud cloud-two" />
      <div className="cloud-cloud cloud-three" />
      <div className="cloud-cloud cloud-four" />
      <div className="cloud-cloud cloud-five" />
      <div className="anime-energy-ring" />
      <div className="anime-energy-ring ring-two" />
      <div className="anime-energy-ring ring-three" />
      <div className="anime-flash" />
      <p>ENTERING THE FLAVOUR WORLD</p>
    </div>
  );
}
