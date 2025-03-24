import iphone13_pink from './images/iphone13_pink.jpg'
import iphone13_black from './images/iphone13_black.jpg'
import iphone13_blue from './images/iphone13_blue.jpg'
import iphone13_white from './images/iphone13_white.jpg'
import s24p_tim from './images/s24-plus-tim.webp'
import s24p_den from './images/s24-plus-den.webp'
import s24p_vang from './images/s24-plus-vang.webp'
import s24p_xam from './images/s24-plus-xam.webp'
import mac_air_m2_silver from './images/macbook_air_m2_silver.webp'
import mac_air_m2_gray from './images/macbook_air_m2_gray.webp'
import apple from './images/apple.png'
import samsung from './images/samsung.png'
import fridge_ss_382 from './images/fridge_ss_382.jpeg'
import fridge_ss_382_1 from './images/fridge_ss_382_1.jpeg'
import fridge_ss_382_2 from './images/fridge_ss_382_2.jpeg'
import fridge_ss_382_3 from './images/fridge_ss_382_3.jpeg'
import AllApi from "../../api/api";

const all_products = [
  {
    "id": 1,
    "name": "Điện thoại iPhone 13 (128GB) - Chính hãng VN/A",
    "rating": 4.7,
    "old_price": 19000000,
    "sale": 20,
    "quantity": 30,
    "category": "Phone",
    "brand": {
      "name": "Apple",
      "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png",
    },
    "variants": [
      {"color": "Đen", "sale": 20,  "quantity": 30, "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/2/12_3_8_2_8.jpg" },
      {"color": "Trắng", "sale": 20, "quantity": 20,"image": "https://cdn2.cellphones.com.vn/x/media/catalog/product/1/5/15_2_7_2_5.jpg"},
      {"color": "Xanh dương", "sale": 20,"quantity": 20, "image":"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/1/11_3_12_2_1_5.jpg"},
      {"color": "Hồng", "sale": 15,  "quantity": 5, "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png"}],
    "description": ["Sản phẩm bao gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp sạc.",
    "- 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
    "- Giá sản phẩm đã bao gồm VAT."],
    "specification" : ["- Kích thước màn hình: 6.1 inches",
      "- Công nghệ màn hình: Super Retina XDR OLED",
      "- Pin: 3240mAh"

    ],


  },

  {
    "id": 2,
    "name": "Điện Thoại Samsung Galaxy S24 Plus - 12GB/256GB - Chính Hãng",
    "rating": 3,
    "images": [s24p_tim, s24p_den, s24p_vang, s24p_xam],
    "old_price": 25000000,
    "sale": 50,
    "quantity": 30,
    "category": "Phone",
    "brand": {
      "name": "Samsung",
      "image": samsung,
    },
    "variants": [
      {"color": "Tím cà thơi", "sale": 15},
      {"color": "Đen", "sale": 20},
      {"color": "Vàng", "sale": 20},
      {"color": "Xám", "sale": 20},
      
    ],
    "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
    " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
    "Giá sản phẩm đã bao gồm VAT."],
    "specification" : ["Kích thước màn hình 6.1 inches",],
  },
  {
    "id": 3,
    "name": "MacBook Air M2 13.6(16GB/256GB) - Chính hãng Apple Việt Nam",
    "rating": 3.5,
    "images": [mac_air_m2_gray, mac_air_m2_silver],
    "old_price": 28000000,
    "sale": 20,
    "quantity": 30,
    "category": "Laptop",
    "brand": {
      "name": "Apple",
      "image": apple,
    },
    "variants": [
      {"color": "Gray", "sale": 17},
      {"color": "Silver", "sale": 20},
    ],
    "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
    " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
    "Giá sản phẩm đã bao gồm VAT."],
    "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
    },
    {
      "id": 4,
      "name": "Tủ lạnh Samsung Inverter 382 lít RT38CG6584B1SV",
      "rating": 3,
      "images": [fridge_ss_382,fridge_ss_382_1,fridge_ss_382_2,fridge_ss_382_3],
      "old_price": 28000000,
      "sale": 20,
      "quantity": 30,
      "category": "Fridge",
      "brand": {
        "name": "Samsung",
        "image": samsung,
      },
      "variants": [
        {"color": "Gray", "sale": 17},
        {"color": "Silver", "sale": 20},
      ],
      "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
      " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
      "Giá sản phẩm đã bao gồm VAT."],
      "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
      },
      {
        "id": 5,
        "name": "Điện thoại iPhone 2 (128GB) - Chính hãng VN/A",
        "rating": 1,
        "images": [ iphone13_white],
        "old_price": 1000000,
        "sale": 20,
        "quantity": 20,
        "category": "Phone",
        "brand": {
          "name": "Apple",
          "image": apple,
        },
        "variants": [
          {"color": "Trắng", "sale": 20, "quantity": 20,},]
        ,
        "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
        " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
        "Giá sản phẩm đã bao gồm VAT."],
        "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
        },
        {
          "id": 6,
          "name": "Điện thoại iPhone 15 (128GB) - Chính hãng VN/A",
          "rating": 5,
          "images": [iphone13_blue, iphone13_pink],
          "old_price": 28000000,
          "sale": 15,
          "quantity": 30,
          "category": "Phone",
          "brand": {
            "name": "Apple",
            "image": apple,
          },
          "variants": [
            {"color": "Đen", "sale": 20,  "quantity": 30,},
            {"color": "Trắng", "sale": 20, "quantity": 20,},
            {"color": "Xanh dương", "sale": 20,"quantity": 20,},
            {"color": "Hồng", "sale": 15,  "quantity": 5,}],
          "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
          " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
          "Giá sản phẩm đã bao gồm VAT."],
          "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"],
        
      
        },
      
        {
          "id": 7,
          "name": "Điện Thoại Samsung Galaxy S22 Plus - 12GB/256GB - Chính Hãng",
          "rating": 3,
          "images": [s24p_den, s24p_vang, s24p_xam],
          "old_price": 25000000,
          "sale": 10,
          "quantity": 30,
          "category": "Phone",
          "brand": {
            "name": "Samsung",
            "image": samsung,
          },
          "variants": [
            {"color": "Tím cà thơi", "sale": 15},
            {"color": "Đen", "sale": 20},
            {"color": "Vàng", "sale": 20},
            {"color": "Xám", "sale": 20},
            
          ],
          "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
          " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
          "Giá sản phẩm đã bao gồm VAT."],
          "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
        },
        {
          "id": 8,
          "name": "MacBook Air M2 13.6(16GB/256GB) - Chính hãng Apple Việt Nam",
          "rating": 3.5,
          "images": [mac_air_m2_gray, mac_air_m2_silver],
          "old_price": 28000000,
          "sale": 20,
          "quantity": 30,
          "category": "Laptop",
          "brand": {
            "name": "Apple",
            "image": apple,
          },
          "variants": [
            {"color": "Gray", "sale": 17},
            {"color": "Silver", "sale": 20},
          ],
          "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
          " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
          "Giá sản phẩm đã bao gồm VAT."],
          "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
          },
          {
            "id": 9,
            "name": "Tủ lạnh Samsung Inverter 382 lít RT38CG6584B1SV",
            "rating": 3,
            "images": [fridge_ss_382,fridge_ss_382_1,fridge_ss_382_2,fridge_ss_382_3],
            "old_price": 28000000,
            "sale": 20,
            "quantity": 30,
            "category": "Fridge",
            "brand": {
              "name": "Samsung",
              "image": samsung,
            },
            "variants": [
              {"color": "Gray", "sale": 17},
              {"color": "Silver", "sale": 20},
            ],
            "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
            " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
            "Giá sản phẩm đã bao gồm VAT."],
            "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
            },
            {
              "id": 10,
              "name": "Điện thoại iPhone 3 (128GB) - Chính hãng VN/A",
              "rating": 3,
              "images": [ iphone13_white],
              "old_price": 10000000,
              "sale": 20,
              "quantity": 20,
              "category": "Phone",
              "brand": {
                "name": "Apple",
                "image": apple,
              },
              "variants": [
                {"color": "Trắng", "sale": 20, "quantity": 20,},]
              ,
              "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
              " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
              "Giá sản phẩm đã bao gồm VAT."],
              "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
              },
              {
                "id": 11,
                "name": "Điện thoại iPhone 8 (128GB) - Chính hãng VN/A",
                "rating": 3,
                "images": [ iphone13_white],
                "old_price": 21000000,
                "sale": 20,
                "quantity": 20,
                "category": "Phone",
                "brand": {
                  "name": "Apple",
                  "image": apple,
                },
                "variants": [
                  {"color": "Trắng", "sale": 20, "quantity": 20,},]
                ,
                "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
                " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
                "Giá sản phẩm đã bao gồm VAT."],
                "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
                },
                {
                  "id": 12,
                  "name": "Điện thoại iPhone 7 (128GB) - Chính hãng VN/A",
                  "rating": 4,
                  "images": [ iphone13_white],
                  "old_price": 20000000,
                  "sale": 20,
                  "quantity": 20,
                  "category": "Phone",
                  "brand": {
                    "name": "Apple",
                    "image": apple,
                  },
                  "variants": [
                    {"color": "Trắng", "sale": 20, "quantity": 20,},]
                  ,
                  "description": ["Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C1",
                  " 1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple.",
                  "Giá sản phẩm đã bao gồm VAT."],
                  "specification" : ["Màn hình OLED 6,7 inch, tốc độ làm mới 60Hz"]
                  },
    
    
    

];
// const response = await AllApi.getAllProduct();
// const all_products = [];

// for (let i = 0; i < response.data.length; i++) {
//     const item = response.data[i];
//     const totalRatings = item.star5 + item.star4 + item.star3 + item.star2 + item.star1;
    
//     let product = {
//         id: item.maHangHoa,
//         name: item.tenHangHoa,
//         rating: item.ratings,
//         old_price: item.gia,
//         category: item.loaiHangHoa,
//         sale: item.variants[0].sale,
//         totalRatings:totalRatings,
//         brand: {
//             name: item.hangSanXuat[0],
//             image: item.hangSanXuat[1],
//         },
//         variants: item.variants.map(variant => ({
//             id: variant.id,
//             color: variant.color,
//             sale: variant.sale,
//             quantity: variant.quantity,
//             image: variant.image,
//         })),
//         description: item.thongTin,
//         specification: item.thongSo,
//     };

//     all_products.push(product);

// }
export default all_products;
