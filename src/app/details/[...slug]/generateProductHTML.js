// Helper function to escape text only (safe for plain strings)
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Helper to build style attribute (unchanged)
function buildStyle(styleObj) {
  if (!styleObj) return "";
  return Object.entries(styleObj)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(";");
}

export function generateProductHTML(product, productInfo, cleanedDetails) {
  if (!product) return "";

  const a_plus_images = product?.a_plus_images || [];

  let html = `<div class="product-detail-server-wrapper hidden">`;
  html += '<div class="">';
  html += '<div class="pb-3 px-3">';
  html += '<div class="2xl:container top-[20px] flex gap-5 !m-auto relative">';

  // Left Side - Product Images
  html += '<div class="flex-[0_0_47%] w-[47%] sticky top-[0px] self-start">';
  html += '<div class="product_Detail_left_side"></div>';
  html += "</div>";

  // Right Side - Product Details
  html += '<div class="flex-grow basis-0 overflow-hidden">';
  html += '<div class="product_Detail_right_side mt-10">';

  // Product Title and Brand - Desktop (escaped)
  html += '<div class="mb-7 hidden md:block">';
  html += `<h6 class="text-[#6F787C] font-medium mb-2 leading-[1.2rem]">${escapeHtml(
    product?.brand || ""
  )}</h6>`;
  html += `<h3 class="!text-[22px] !font-semibold mb-3">${escapeHtml(
    product?.name || ""
  )}</h3>`;
  html += "</div>";

  html += '<hr class="text-[#b3aaaa] mb-0 hidden md:block" />';

  // Price Section (escaped)
  html += '<div class="my-7">';
  html += '<div class="product_Detail_price_container flex">';
  html += '<div class="display_price flex items-center">';
  html += '<span class="font-bold text-xl flex items-center">';
  html +=
    '<span class="currency-symbol mr-1 text-[24px] md:text-[26px]"></span>';
  html += `<span class="text-[24px] md:text-[26px]">${escapeHtml(
    product?.display_price || ""
  )}</span>`;
  html += "</span>";
  html += "</div>";
  html += "</div>";

  if (
    product?.hasOwnProperty("old_price") &&
    Number(product?.display_price) < Number(product?.old_price)
  ) {
    html += '<div class="old_price">';
    html += `<span>${escapeHtml(product?.old_price || "")}</span>`;
    html += '<div class="product_Detail_price_container">';
    html += `<div class="display_percentage">${escapeHtml(
      (product?.percentage || 0) + "% OFF"
    )}</div>`;
    html += "</div>";
    html += '<p class="text-[#9EA5A8] mb-0 text-base">(Inc. of VAT)</p>';
    html += "</div>";
  }
  html += "</div>";

  // Stock Status
  if (product?.stock === "In stock") {
    html += '<div class="my-6">';
    html += '<div class="product_Detail_btn_container flex gap-3">';
    html +=
      '<span class="ml-1 font-semibold" style="font-family:Outfit;font-size:16px">IN STOCK</span>';
    html += '<div class="flex items-center justify-center">';
    html +=
      '<img src="/assets/vector_icons/fire.png" alt="fire" width="11.75" height="20" />';
    html +=
      '<span class="ml-1 font-bold" style="color:#E78B00;font-family:Outfit;font-size:14px">Selling out fast!</span>';
    html += "</div>";
    html += "</div>";

    html += '<div class="flex items-center gap-2 flex-nowrap min-w-0">';
    if (product?.fastTrack === 1) {
      html +=
        '<img src="/assets/vector_icons/Express_delivery.gif" alt="gif" width="230" height="35" />';
    }
    const deliveryText = product?.delivery || "";
    const afterDelivery = deliveryText.split("Delivery ")[1] || "";
    const [beforeExpected, afterExpected] = afterDelivery.split("Expected ");
    html += `<span class="whitespace-nowrap ${
      product?.fastTrack === 0 ? "ml-1" : ""
    }" style="font-family:Outfit;font-size:14px">`;
    html += escapeHtml(beforeExpected);
    if (afterExpected) {
      html += " Expected  ";
      html += `<strong class="font-bold text-base">${escapeHtml(
        afterExpected.trim()
      )}</strong>`;
    }
    html += "</span>";
    html += "</div>";
    html += "</div>";
  }

  // Trust Badges - Desktop
  html += '<div class="my-4 hidden md:block">';
  html += '<div class="grid gap-2 grid-cols-2 xl:flex xl:justify-between">';
  const badges = [
    {
      img: "/assets/vector_icons/top_rated_customer.png",
      text: "Top Rated By Customers",
    },
    {
      img: "/assets/vector_icons/Secure_Transaction.png",
      text: "Secure Transaction",
    },
    {
      img: "/assets/vector_icons/Exchange_Available.png",
      text: "Exchange Available",
    },
    {
      img: "/assets/vector_icons/Pay_Delivery.png",
      text: "Cash/Pay On Delivery",
    },
  ];
  badges.forEach((badge) => {
    html += '<div class="flex text-center gap-2 items-center">';
    html += `<img src="${escapeHtml(badge.img)}" alt="${escapeHtml(
      badge.text
    )}" width="70" height="70" class="mb-2 bg-gray-100 p-2 rounded-full" />`;
    html += `<div class="flex items-center text-start text-sm font-semibold">${escapeHtml(
      badge.text
    )}</div>`;
    html += "</div>";
  });
  html += "</div>";
  html += "</div>";

  // Alternate Attributes
  if (product?.alternateAttributes) {
    product.alternateAttributes.forEach((attribute) => {
      if (!attribute?.list?.length) return;
      html += '<div class="mb-3">';
      html += `<h6 class="mb-0 font-semibold text-lg font-[Outfit]">${escapeHtml(
        attribute.title || ""
      )}</h6>`;
      html += '<div class="flex mt-2 gap-[14px] flex-wrap">';
      attribute.list.forEach((attribute_item) => {
        const isActive = productInfo.productSku === attribute_item.sku;
        const colorStyle = attribute_item?.code?.startsWith("#")
          ? attribute_item.code
          : "#" + attribute_item.code;

        if (attribute_item.code === "") {
          html += '<div class="flex">';
          html += `<a href="/details/${escapeHtml(
            attribute_item.url
          )}" class="no-underline flex items-center cursor-pointer">`;
          const activeClass = isActive
            ? "custom_border_select font-bold text-[16px]"
            : "image-border text-[#43494B] font-medium";
          html += `<h6 class="text-[14px] text-center rounded-full whitespace-nowrap px-10 py-3 border ${activeClass}">${escapeHtml(
            attribute_item?.name || ""
          )}</h6>`;
          html += "</a>";
          html += "</div>";
        } else {
          html += '<div class="flex">';
          html += `<a href="/details/${escapeHtml(
            attribute_item.url
          )}" class="no-underline flex flex-col items-center cursor-pointer w-max max-w-16">`;
          const activeClass = isActive
            ? "custom_border_select"
            : "image-border";
          html += `<div class="flex items-center justify-center w-10 h-10 rounded-full ${activeClass}">`;
          html += `<div style="background:${escapeHtml(
            colorStyle
          )};width:28px;height:28px;border-radius:50%"></div>`;
          html += "</div>";
          const textClass = isActive
            ? "text-[#43494B] font-bold text-[15px]"
            : "text-[#43494B] font-medium";
          html += `<h6 class="mt-3 text-[14px] text-center ${textClass}">${escapeHtml(
            attribute_item.name || ""
          )}</h6>`;
          html += "</a>";
          html += "</div>";
        }
      });
      html += "</div>";
      html += "</div>";
    });
  }

  // Product Specifications
  html += '<div class="mt-8">';
  html += '<div class="accordian_border relative mb-4 overflow-hidden">';
  html += '<div class="p-3 cursor-default flex justify-between items-center">';
  html +=
    '<span class="font-semibold" style="font-family:Outfit;font-size:18px">Product Specifications</span>';
  html += "</div>";

  html += '<div class="bg-white px-3 py-4 max-h-[50vh] overflow-y-auto">';
  html += '<div class="specification-main relative">';

  if (product?.small_desc_data) {
    product.small_desc_data.slice(0, 3).forEach((ele, index) => {
      const bgClass = index % 2 === 0 ? "evenbacground" : "nooddbackground";
      html += `<div class="flex flex-wrap specificationdetails ${bgClass}">`;
      html +=
        '<div class="w-full lg:w-1/3 md:w-1/3 sm:w-1/2 specificationtitle">';
      html += escapeHtml(ele.title || "");
      html += "</div>";
      html +=
        '<div class="w-full lg:w-2/3 md:w-2/3 sm:w-1/2 specificationvalue">';
      html += escapeHtml(ele.value || "");
      html += "</div>";
      html += "</div>";
    });
  }

  html += "</div>";

  html += '<div class="product-spec-table mt-2">';
  html += '<div style="max-height:150px;overflow:hidden">';
  html += '<div class="overflow-x-auto">';
  html += '<table class="table table-auto m-0">';
  html += `<tbody>${cleanedDetails || ""}</tbody>`; // raw HTML inserted without escaping here
  html += "</table>";
  html += "</div>";
  html += "</div>";
  html += "</div>";

  html += "</div>";
  html += "</div>";
  html += "</div>";
  html += "</div>";

  // A+ content section
  if (a_plus_images.length > 0) {
    html += '<div class="flex flex-col pb-7 sm:pb-0">';
    a_plus_images.forEach((img) => {
      html += `<img src="${escapeHtml(
        img
      )}" alt="A+ content" width="1200" height="800" class="w-full h-auto" />`;
    });
    html += "</div>";
  }

  html += "</div>";
  html += "</div>";
  html += "</div>";
  html += "</div>";

  return html;
}
