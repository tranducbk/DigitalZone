
const data_products = [
    {
        "id": 1,
        "name": "Điện thoại iPhone 13 (128GB) - Chính hãng VN/A",
        "rating": 4.7,
        "images": ["https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/2/12_3_8_2_8.jpg",
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/1/5/15_2_7_2_5.jpg",
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/1/11_3_12_2_1_5.jpg", 
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png"],
        "old_price": 19000000,
        "sale": 20,
        "quantity": 30,
        "category": "Phone",
        "brand": {
          "name": "Apple",
          "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
        },
        "variants": [
          {"color": "Đen", "sale": 20,  "quantity": 30,},
          {"color": "Trắng", "sale": 20, "quantity": 20,},
          {"color": "Xanh dương", "sale": 20,"quantity": 20,},
          {"color": "Hồng", "sale": 15,  "quantity": 5,}],
        "description": 
        ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
        "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
        "- Giá sản phẩm đã bao gồm VAT."],
        "specification" : ["- Kích thước màn hình: 6.1 inches",
          "- Công nghệ màn hình: Super Retina XDR OLED",
          "- Pin: 3240mAh"
    
        ],
    },
  
    {
      "id": 2,
      "name": "Samsung Galaxy S23 Ultra 256GB",
      "rating": 4.5,
      "images": ["https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim.png",
        "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/a/samsung-s23-ulatra_2__4.png", 
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-kem-1.png",
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-s23-ulatra_1__1.png"],
      "old_price": 25000000,
      "sale": 50,
      "quantity": 30,
      "category": "Phone",
      "brand": {
        "name": "Samsung",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
      },
      "variants": [
        {"color": "Tím", "sale": 15},
        {"color": "Đen", "sale": 20},
        {"color": "Trắng", "sale": 20},
        {"color": "Xanh", "sale": 20},],
      "description": 
      ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
        "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
        "- Giá sản phẩm đã bao gồm VAT."],
      "specification" : [
        "- Kích thước màn hình: 6.8 inches",
        "- Công nghệ màn hình: Dynamic AMOLED 2X",
        "- Pin: 5000mAh"
      ],
      
    },
    {
      "id": 3,
      "name": "Điện thoại iPhone 15 (512GB) - Chính hãng VN/A",
      "rating": 4.7,
      "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/09/13/iphone-15-black-pure-back-iphone-15-black-pure-front-2up-screen-usen.png",
      "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/09/13/iphone-15-blue-pure-back-iphone-15-blue-pure-front-2up-screen-usen.png",
      "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/09/13/iphone-15-yellow-pure-back-iphone-15-yellow-pure-front-2up-screen-usen.png", 
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb_5.png"],
      "old_price": 19000000,
      "sale": 20,
      "quantity": 30,
      "category": "Phone",
      "brand": {
        "name": "Apple",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
      },
      "variants": [
        {"color": "Đen", "sale": 20,  "quantity": 30,},
        {"color": "Xanh dương", "sale": 20, "quantity": 20,},
        {"color": "Vàng", "sale": 20,"quantity": 20,},
        {"color": "Hồng", "sale": 15,  "quantity": 5,}],
      "description": 
      ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
      "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
      "- Giá sản phẩm đã bao gồm VAT."],
      "specification" : ["- Kích thước màn hình: 6.1 inches",
        "- Công nghệ màn hình: Super Retina XDR",
        "- Pin: 5000mAh"
  
      ],
  },
  {
    "id": 4,
    "name": "Điện thoại iPhone 11 (64GB) - Chính hãng VN/A",
    "rating": 4.6,
    "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2020/09/17/51kGDXeFZKL._SL1024_.jpg",
    "https://cdn.hoanghamobile.com/i/preview/Uploads/2020/09/17/apple-iphone-11-64gb-6.1.jpg",
    "https://cdn.hoanghamobile.com/i/preview/Uploads/2020/09/17/11_Green.jpg", 
    "https://cdn.hoanghamobile.com/i/preview/Uploads/2021/02/03/iphone-11-64gb.png"],
    "old_price": 10000000,
    "sale": 20,
    "quantity": 30,
    "category": "Phone",
    "brand": {
      "name": "Apple",
      "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
    },
    "variants": [
      {"color": "Đen", "sale": 20,  "quantity": 30,},
      {"color": "Trắng", "sale": 20, "quantity": 20,},
      {"color": "Xanh lá", "sale": 20,"quantity": 20,},
      {"color": "Tím", "sale": 15,  "quantity": 5,}],
    "description": 
    ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
    "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
    "- Giá sản phẩm đã bao gồm VAT."],
    "specification" : ["- Kích thước màn hình: 6.1 inches",
      "- Công nghệ màn hình: IPS LCD",
      "- Pin: 2900 mAh"

    ],
},
{
  "id": 5,
  "name": "Điện thoại Redmi Note 13 Pro (8GB/128GB) - Chính hãng",
  "rating": 4.7,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2024/02/20/redmi-note-13-pro-green.png", 
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/02/20/redmi-note-13-pro-purple.png"],
  "old_price": 19000000,
  "sale": 20,
  "quantity": 30,
  "category": "Phone",
  "brand": {
    "name": "Xiaomi",
    "image":"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_61.png",
  },
  "variants": [
    {"color": "Xanh lá", "sale": 20,  "quantity": 30,},
    {"color": "Tím", "sale": 20, "quantity": 20,},
    ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["- Kích thước màn hình: 6.67 inches",
    "- Công nghệ màn hình: AMOLED 120Hz",
    "- Pin: 5000 mAh"

  ],
},

{
  "id": 6,
  "name": "Điện Thoại AI - Samsung Galaxy S24 - 8GB/512GB - Chính hãng",
  "rating": 4.7,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/30/samsung-galaxy-s24-3.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/30/samsung-galaxy-s24-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/30/samsung-galaxy-s24-4.png", 
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/30/samsung-galaxy-s24-2.png"],
  "old_price": 26000000,
  "sale": 10,
  "quantity": 30,
  "category": "Phone",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
  },
  "variants": [
    {"color": "Tím", "sale": 10,  "quantity": 30,},
    {"color": "Xám", "sale": 10, "quantity": 20,},
    {"color": "Vàng", "sale": 10,"quantity": 20,},
    {"color": "Đen", "sale": 10,  "quantity": 5,}],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["- Kích thước màn hình: 6.2 inches",
    "- Công nghệ màn hình: Dynamic AMOLED 2X",
    "- Pin: 4000 mAh"

  ],
},
{
  "id": 7,
  "name": "Điện thoại Vivo Y36 8GB/128GB- chính hãng",
  "rating": 4.7,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/07/27/image-removebg-preview-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/07/27/image-removebg-preview-2.png",
  ],
  "old_price": 6000000,
  "sale": 20,
  "quantity": 30,
  "category": "Phone",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
  },
  "variants": [
    {"color": "Đen", "sale": 20,  "quantity": 30,},
    {"color": "Xanh dương", "sale": 20,"quantity": 20,},
  ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["- Kích thước màn hình: 6.2 inches",
    "- Công nghệ màn hình: IPS LCD",
    "- Pin: 5000mAh"

  ],
},
{
  "id": 8,
  "name": "Điện thoại OPPO A58 (6GB/128GB) - Chính hãng",
  "rating": 4.8,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/08/01/oppo-a58-den.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/08/24/a58-5.png",
 ],
  "old_price": 5500000,
  "sale": 20,
  "quantity": 30,
  "category": "Phone",
  "brand": {
    "name": "Oppo",
    "image": "https://cdn.hoanghamobile.com/i/cat/Uploads/2020/09/14/brand%20(3).png",
  },
  "variants": [
    {"color": "Đen", "sale": 20,  "quantity": 30,},
    {"color": "Xanh dương", "sale": 20,"quantity": 20,},
  ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["- Kích thước màn hình: 6 inches",
    "- Công nghệ màn hình: Màn hình đục lỗ | LCD",
    "- Pin: 5000 mAh"

  ],
},
{
  "id": 9,
  "name": "Điện thoại Redmi Note 13 Pro+ 5G (8GB/256GB) - Chính hãng",
  "rating": 4.5,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/03/redmi-note-13-pro-plus-5g-black-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/03/redmi-note-13-pro-plus-5g-purple-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/03/redmi-note-13-pro-plus-5g-white-1.png", 
  ],
  "old_price": 5000000,
  "sale": 20,
  "quantity": 30,
  "category": "Phone",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
  },
  "variants": [
    {"color": "Đen", "sale": 20,  "quantity": 30,},
    {"color": "Tím", "sale": 15,  "quantity": 5,},
    {"color": "Trắng", "sale": 20, "quantity": 20,},
  ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["- Kích thước màn hình: 6.2 inches",
    "- Công nghệ màn hình: CrystalRes AMOLED",
    "- Pin: 5000mAh"

  ],
},





{
  "id": 10,
  "name": "MacBook Air M2 15 (8GB/256GB)- Chính hãng Apple Việt Nam",
  "rating": 4.8,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-grey-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-midnight-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-silver-1.png", 
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-starlight-1.png"],
  "old_price": 30000000,
  "sale": 20,
  "quantity": 30,
  "category": "Laptop",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
  },
  "variants": [
    {"color": "Space Gray", "sale": 20,  "quantity": 30,},
    {"color": "Midnight", "sale": 20, "quantity": 20,},
    {"color": "Silver", "sale": 20,"quantity": 20,},
    {"color": "Starlight", "sale": 15,  "quantity": 5,}],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["RAM: 8GB", 
  "Độ phân giải: 2880x1864", 
  "Kết nối không dây: Wi-Fi 6 (802.11ax), Bluetooth 5.3"
 
  ],
},

{
  "id": 11,
  "name": "MacBook Air M1 (8GB/256GB)- Chính hãng Apple Việt Nam",
  "rating": 4.6,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-grey-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-midnight-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-silver-1.png", 
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-starlight-1.png"],
  "old_price": 23000000,
  "sale": 20,
  "quantity": 30,
  "category": "Laptop",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
  },
  "variants": [
    {"color": "Space Gray", "sale": 20,  "quantity": 30,},
    {"color": "Midnight", "sale": 20, "quantity": 20,},
    {"color": "Silver", "sale": 20,"quantity": 20,},
    {"color": "Starlight", "sale": 15,  "quantity": 5,}],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["RAM: 8GB", 
  "Độ phân giải: 2880x1864", 
  "Kết nối không dây: Wi-Fi 6 (802.11ax), Bluetooth 5.3"
 
  ],
},{
  "id": 12,
  "name": "MacBook Air M3 15 - Chính hãng Apple Việt Nam",
  "rating": 4.9,
  "images": ["https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-grey-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-midnight-1.png",
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-silver-1.png", 
  "https://cdn.hoanghamobile.com/i/preview/Uploads/2023/06/06/mba15-starlight-1.png"],
  "old_price": 35000000,
  "sale": 20,
  "quantity": 30,
  "category": "Laptop",
  "brand": {
    "name": "Apple",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
  },
  "variants": [
    {"color": "Space Gray", "sale": 20,  "quantity": 30,},
    {"color": "Midnight", "sale": 20, "quantity": 20,},
    {"color": "Silver", "sale": 20,"quantity": 20,},
    {"color": "Starlight", "sale": 15,  "quantity": 5,}],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : ["RAM: 8GB", 
  "Độ phân giải: 2880x1864", 
  "Kết nối không dây: Wi-Fi 6 (802.11ax), Bluetooth 5.3"
  ],
},




{
  "id": 13,
  "name": "Samsung Inverter 9 Kg",
  "rating": 4.8,
  "images": ["https://cdn.tgdd.vn/Products/Images/1944/285245/may-giat-samsung-inverter-9-kg-ww90t634dln-sv-051222-105313-600x600.jpg",
],
  "old_price": 13000000,
  "sale": 10,
  "quantity": 30,
  "category": "May giat",
  "brand": {
    "name": "Samsung",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
  },
  "variants": [
    {"color": "12 KG", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
     "Loại máy: Cửa ngang Có Inverter",
     "Khối lượng giặt: 9 Kg Trên 5 người",
     "Kiểu động cơ: Truyền động trực tiếp bền & êm",
  ],
},
{
  "id": 14,
  "name": "Máy giặt Samsung Inverter 12 kg",
  "rating": 4.9,
  "images": ["https://cdn.tgdd.vn/Products/Images/1944/302751/may-giat-samsung-12kg-wa12cg5745bvsv-300623-033726-600x600.jpg",
],
  "old_price": 11000000,
  "sale": 10,
  "quantity": 30,
  "category": "May giat",
  "brand": {
    "name": "Samsung",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
  },
  "variants": [
    {"color": "12 KG", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
     "Loại máy: Cửa trên Lồng đứng Có Inverter",
     "Khối lượng giặt: 12 Kg Trên 7 người",
     "Kiểu động cơ: Truyền động trực tiếp bền & êm",
  ],
},





{
  "id": 15,
  "name": "Tủ lạnh Sharp Inverter 362 lít Multi Door",
  "rating": 4.9,
  "images": ["https://cdn.tgdd.vn/Products/Images/1943/283731/tu-lanh-sharp-inverter-362-lit-sj-fx420vg-bk-17-600x600.jpg",
],
  "old_price": 16000000,
  "sale": 10,
  "quantity": 30,
  "category": "Tu lanh",
  "brand": {
    "name": "Sharp",
    "image": "",
  },
  "variants": [
    {"color": "362L", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  [
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
    "Công nghệ tiết kiệm điện Inverter Chế độ Extra Eco",
    "Công nghệ làm lạnh: Làm lạnh đa chiều",
    "Công nghệ kháng khuẩn khử mùi: Bộ lọc khử mùi Deodorizer"
  ],
},

{
  "id": 15,
  "name": "Tủ lạnh LG Inverter 264 Lít",
  "rating": 4.9,
  "images": ["https://cdn.tgdd.vn/Products/Images/1943/284310/tu-lanh-lg-inverter-264-lit-gv-d262bl51.jpg",
],
  "old_price": 11000000,
  "sale": 10,
  "quantity": 30,
  "category": "Tu lanh",
  "brand": {
    "name": "LG",
    "image": "https://cdn.tgdd.vn/Category/Quicklink/1943/2/090823-045037.png",
  },
  "variants": [
    {"color": "264L", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  [
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
    "Công nghệ tiết kiệm điện Inverter Chế độ Extra Eco",
    "Công nghệ làm lạnh: Làm lạnh đa chiều",
    "Công nghệ kháng khuẩn khử mùi: Bộ lọc khử mùi Deodorizer"
  ],
},




// Điều hoà 
{
  "id": 16,
  "name": "Máy lạnh Panasonic Inverter 1 HP CU/CS-PU9AKH-8",
  "rating": 4.7,
  "images": ["https://cdn.tgdd.vn/Products/Images/1943/284310/tu-lanh-lg-inverter-264-lit-gv-d262bl51.jpg",
],
  "old_price": 13000000,
  "sale": 10,
  "quantity": 30,
  "category": "Dieu hoa",
  "brand": {
    "name": "Panasonic",
    "image": "https://cdn.tgdd.vn/Category/Quicklink/2002/2/220823-112818.png",
  },
  "variants": [
    {"color": "1HP", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  [
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
    "Lọc bụi, kháng khuẩn, khử mùi: Nanoe-G lọc bụi mịn PM 2.5",
    "Công nghệ tiết kiệm điện: Inverter ECO tích hợp A.I",
    "Làm lạnh nhanh: Powerful",
  ],
},



// TV
{
  "id": 17,
  "name": "Smart Tivi Samsung 4K 65 inch UA65AU7002",
  "rating": 4.7,
  "images": ["https://cdn.tgdd.vn/Products/Images/1942/279932/TimerThumb/smart-samsung-4k-65-inch-ua65au7002-(28).jpg",
],
  "old_price": 13000000,
  "sale": 10,
  "quantity": 30,
  "category": "TV",
  "brand": {
    "name": "Samsung",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
   
  },
  "variants": [
    {"color": "65 inchP", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  [
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
    "Chiếu hình từ điện thoại lên TV: Screen MirroringAirPlay 2"
  ],
},


{
  "id": 18,
  "name": "Bộ loa thanh Samsung HW-C450/XV 300W",
  "rating": 4.7,
  "images": ["https://cdn.tgdd.vn/Products/Images/2162/304783/304783-600x600.jpg",
],
  "old_price": 4000000,
  "sale": 10,
  "quantity": 30,
  "category": "TV",
  "brand": {
    "name": "Samsung",
    "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png",
   
  },
  "variants": [
    {"color": "300W", "sale": 10,  "quantity": 30,},
    ],
  "description": 
  [
  "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
  "- Giá sản phẩm đã bao gồm VAT."],
  "specification" : [
    "Tổng công suất: 300W",
    "Nguồn: Cắm điện dùng",
    "Số lượng kênh: 2.1 kênh",
  ],
},



// Smart Home







]
  
       
  export default data_products;
  