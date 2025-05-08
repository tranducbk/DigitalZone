import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center text-lg-start text-white"
      style={{ backgroundColor: "#6f161f" }}
    >
      {/* Section: Social media */}
      <section
        className="d-flex justify-content-between p-4" style={{ backgroundColor: "#d70018"}}
      >
        <div className="me-5">
            <span style={{ fontWeight: 700 }}>Kết nối với DigitalZone:</span>
        </div>
        <div>
          <a href="#" className="text-white me-4 p-4 ">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-white me-4 p-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white me-4 p-4">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="text-white me-4 p-4">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-white me-4 p-4">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="text-white me-4 p-4">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </section>

      {/* Section: Links */}
      <section className="container text-center text-md-start mt-5">
        <div className="row mt-3">
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold">DigitalZone</h6>
            <hr
              className="mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px", backgroundColor: "#fff", height: "2px" }}
            />
            <p>
            DigitalZone là địa chỉ tin cậy cho mọi người khi tìm kiếm các sản phẩm điện máy và điện tử chất lượng cao
            </p>
          </div>

          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold">Hỗ trợ khách hàng</h6>
            <hr
              className="mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px", backgroundColor: "#fff", height: "2px" }}
            />
            <p>
              <a href="#" className="text-white option-footer">
                Tra cứu đơn hàng
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Hướng dẫn mua hàng trực tuyến
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Hướng dẫn thanh toán
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Góp ý, Khiếu Nại
              </a>
            </p>
          </div>

          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold">Thông tin khuyến mại</h6>
            <hr
              className="mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px", backgroundColor: "#fff", height: "2px" }}
            />
            <p>
              <a href="#" className="text-white option-footer">
                Thông tin khuyến mại
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Sản phẩm khuyến mại
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Sản phẩm mới
              </a>
            </p>
            <p>
              <a href="#" className="text-white option-footer">
                Hỗ trợ
              </a>
            </p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase fw-bold">Liên hệ</h6>
            <hr
              className="mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px", backgroundColor: "#fff", height: "2px" }}
            />
            <p>
              <i className="fas fa-home mr-3"></i> Hai Bà Trưng, Hà Nội
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> digitalzone@gmail.com
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> 1800 6789   
            </p>
            <p>
              <i className="fas fa-print mr-3"></i> 1800 6688
            </p>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2025 Copyright:{" "}
        <a className="text-white">
          DigitalZone
        </a>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
      ></link>
    </footer>
  );
};

export default Footer;
