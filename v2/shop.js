/* ============================================================
   Odds Are Jesus — Shopify Buy Button integration
   Renders the three live products (tee / cap / mug) with
   brand-matched Buy Button components + cart.
   ============================================================ */
(function () {
  "use strict";

  var SHOPIFY_DOMAIN = "odds-are-jesus.myshopify.com";
  var STOREFRONT_TOKEN = "1821a8eb41ddd8da4865e256e1047b81";
  var PRODUCT_IDS = {
    "buybtn-tee": "9610877501542",
    "buybtn-cap": "9610892836966",
    "buybtn-mug": "9610895097958",
  };

  var GOLD = "#f2a93b";
  var GOLD_DARK = "#1a1206";
  var GOLD_HOVER = "#d9972f";

  var BUTTON_STYLE = {
    "background-color": GOLD,
    color: GOLD_DARK,
    "font-weight": "700",
    "border-radius": "12px",
    ":hover": { "background-color": GOLD_HOVER },
    ":focus": { "background-color": GOLD_HOVER },
  };

  function productOptions() {
    return {
      product: {
        styles: {
          button: BUTTON_STYLE,
          title: { color: "#ffffff", "font-size": "17px", "font-weight": "700" },
          price: { color: "#a3a3a8", "font-size": "15px" },
          compareAt: { color: "#6e6e73" },
          unitPrice: { color: "#6e6e73" },
          description: { color: "#a3a3a8" },
        },
        contents: {
          img: true,
          title: true,
          price: true,
          options: true,
          quantity: true,
          button: true,
          description: false,
        },
        text: { button: "Add to cart" },
      },
      cart: {
        styles: {
          button: BUTTON_STYLE,
          title: { color: "#ffffff" },
          header: { color: "#ffffff" },
          lineItems: { color: "#ffffff" },
          subtotalText: { color: "#a3a3a8" },
          subtotal: { color: "#ffffff" },
          notice: { color: "#a3a3a8" },
          empty: { color: "#ffffff" },
        },
        text: { title: "Your cart", empty: "Your cart is empty.", button: "Checkout" },
        popup: false,
      },
      toggle: {
        styles: {
          toggle: {
            "background-color": GOLD,
            ":hover": { "background-color": GOLD_HOVER },
            ":focus": { "background-color": GOLD_HOVER },
          },
          count: { color: GOLD_DARK },
          iconPath: { fill: GOLD_DARK },
        },
      },
      option: {
        styles: {
          label: { color: "#ffffff" },
          select: {
            "background-color": "#151515",
            color: "#ffffff",
            "border-color": "#222222",
            "border-radius": "10px",
          },
        },
      },
      quantityInput: {
        styles: {
          input: {
            "background-color": "#151515",
            color: "#ffffff",
            "border-color": "#222222",
            "border-radius": "10px",
          },
          button: { color: "#ffffff" },
        },
      },
    };
  }

  function init() {
    if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;
    var client = ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: STOREFRONT_TOKEN,
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      Object.keys(PRODUCT_IDS).forEach(function (elId) {
        var node = document.getElementById(elId);
        if (!node) return;
        ui.createComponent("product", {
          id: PRODUCT_IDS[elId],
          node: node,
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: productOptions(),
        });
      });
    });
  }

  function fallback() {
    // If the Buy Button SDK can't load, leave a clean note instead of empty cards.
    Object.keys(PRODUCT_IDS).forEach(function (elId) {
      var node = document.getElementById(elId);
      if (node && !node.hasChildNodes()) {
        node.innerHTML =
          '<p class="buybtn-fallback">Our store is getting ready — check back soon.</p>';
      }
    });
  }

  var script = document.createElement("script");
  script.async = true;
  script.src =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  script.onload = init;
  script.onerror = fallback;
  (document.head || document.documentElement).appendChild(script);
  // Safety net: if the SDK never initializes, show the fallback message.
  setTimeout(function () {
    if (!window.ShopifyBuy || !window.ShopifyBuy.UI) fallback();
  }, 8000);
})();
