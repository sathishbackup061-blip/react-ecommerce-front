import React, {
  useEffect,
  useState,
} from "react";

import {
  Carousel,
  Spin,
  Empty,
  Button,
} from "antd";

import {
  getBanners,
} from "../../functions/banner";

const HomeBanner = () => {
  const [loading, setLoading] =
    useState(false);

  const [slides, setSlides] =
    useState([]);

  // =============================
  // LOAD ALL BANNERS
  // =============================
  const loadBanners =
    async () => {
      try {
        setLoading(true);

        const res =
          await getBanners();

        console.log(
          "ALL BANNERS =>",
          res.data
        );

        // =============================
        // FLATTEN ALL IMAGES
        // =============================
        const allSlides = [];

        res.data.forEach((banner) => {
          // MULTIPLE IMAGES
          if (
            banner.images &&
            banner.images.length > 0
          ) {
            banner.images.forEach(
              (img) => {
                allSlides.push({
                  ...banner,
                  image: img,
                });
              }
            );
          }

          // SINGLE IMAGE SUPPORT
          else if (banner.image) {
            allSlides.push({
              ...banner,
              image: banner.image,
            });
          }
        });

        console.log(
          "ALL SLIDES =>",
          allSlides
        );

        setSlides(allSlides);

        setLoading(false);

      } catch (err) {
        console.log(err);

        setLoading(false);
      }
    };

  useEffect(() => {
    loadBanners();
  }, []);

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <div
        style={{
          height: "500px",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // =============================
  // EMPTY
  // =============================
  if (!slides.length) {
    return (
      <div className="container py-5">
        <Empty description="No banners found" />
      </div>
    );
  }

  return (
    <div className="hero-banner-wrapper">
      <Carousel
        autoplay
        dots
        autoplaySpeed={4000}
      >
        {slides.map(
          (slide, index) => (
            <div key={index}>
              <div
                style={{
                  position:
                    "relative",
                  width: "100%",
                  height: "400px",
                  overflow:
                    "hidden",
                }}
              >
                {/* IMAGE */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit:
                      "cover",
                  }}
                />

                {/* OVERLAY */}
                <div
                  style={{
                    position:
                      "absolute",
                    inset: 0,
                    background:
                      "rgba(0,0,0,0.45)",
                  }}
                />

                {/* CONTENT */}
                <div
                  style={{
                    position:
                      "absolute",
                    top: "50%",
                    left: "8%",
                    transform:
                      "translateY(-50%)",
                    color: "#fff",
                    maxWidth:
                      "650px",
                    zIndex: 2,
                  }}
                >
                  {/* TYPE */}
                  <span
                    style={{
                      background:
                        "rgba(255,255,255,0.2)",
                      padding:
                        "6px 16px",
                      borderRadius:
                        "30px",
                      fontSize:
                        "14px",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {slide.type}
                  </span>

                  {/* TITLE */}
                  <h1
                    style={{
                      fontSize:
                        "58px",
                      fontWeight:
                        "700",
                      marginTop:
                        "20px",
                      marginBottom:
                        "16px",
                      lineHeight: 1.2,
                      color: "#fff",
                    }}
                  >
                    {slide.title}
                  </h1>

                  {/* SUBTITLE */}
                  <h3
                    style={{
                      color:
                        "rgba(255,255,255,0.9)",
                      marginBottom:
                        "20px",
                      fontWeight: 400,
                    }}
                  >
                    {slide.subtitle}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      fontSize:
                        "16px",
                      lineHeight: 1.8,
                      color:
                        "rgba(255,255,255,0.85)",
                      marginBottom:
                        "30px",
                    }}
                  >
                    {
                      slide.description
                    }
                  </p>

                  {/* BUTTON */}
                  <a
                    href={
                      slide.link ||
                      "#"
                    }
                  >
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        height:
                          "50px",
                        padding:
                          "0 32px",
                        borderRadius:
                          "50px",
                        fontWeight: 600,
                      }}
                    >
                      Shop Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      </Carousel>
    </div>
  );
};

export default HomeBanner;