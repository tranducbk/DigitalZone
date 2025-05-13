import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Row,
  Col,
  Divider,
  message,
  Upload,
  Image,
  Typography,
  Tooltip,
  Card,
  Select,
  Spin,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import apiService from "../../api/api";

const { Title, Text } = Typography;

const EditProduct = ({ product, closeModal, onProductUpdated }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);

  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [brandsList, setBrandsList] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await apiService.getAllCategories();
        if (response.data && Array.isArray(response.data.categories)) {
          setCategoriesList(response.data.categories);
        } else {
          message.error("Không thể tải danh sách loại sản phẩm.");
        }
      } catch (error) {
        console.error("Lỗi khi tải loại sản phẩm:", error);
        message.error("Lỗi khi tải danh sách loại sản phẩm.");
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const response = await apiService.getAllBrands();
        if (response.data && Array.isArray(response.data.brands)) {
          setBrandsList(response.data.brands);
        } else {
          message.error("Không thể tải danh sách thương hiệu.");
        }
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
        message.error("Lỗi khi tải danh sách thương hiệu.");
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        description: Array.isArray(product.description) ? product.description.join("\n") : product.description || "",
        specifications: Array.isArray(product.specifications) ? product.specifications.join("\n") : product.specifications || "",
        brand: product.brand?.name || "",
      });
      setVariants(
        (product.variants || []).map((v, index) => ({
          ...v,
          key: v._id || `variant-${Date.now()}-${index}`,
          imageFile: null,
        }))
      );
    }
  }, [product, form]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại các trường thông tin!");
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { key: `new-${Date.now()}`, color: "", quantity: 0, sale: 0, image: "", imageFile: null },
    ]);
  };

  const removeVariant = (keyToRemove) => {
     if (variants.length <= 1) {
        message.warn("Sản phẩm phải có ít nhất một biến thể.");
        return;
    }
    setVariants(variants.filter((variant) => variant.key !== keyToRemove));
  };

  const handleVariantChange = (key, field, value) => {
    setVariants(
      variants.map((variant) =>
        variant.key === key ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleVariantImageUpload = (key, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleVariantChange(key, "image", reader.result);
      handleVariantChange(key, "imageFile", file);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    return false;
  };

  const onFinish = async (values) => {
    try {
      if (!product._id) {
        message.error("ID sản phẩm không hợp lệ để cập nhật.");
        return;
      }

      const selectedBrand = brandsList.find(b => b.name === values.brand);
      if (!selectedBrand) {
        message.error("Thương hiệu đã chọn không hợp lệ. Vui lòng làm mới và chọn lại.");
        return;
      }

      const updatedProductData = {
        name: values.name,
        category: values.category,
        brand: {
          name: selectedBrand.name,
          image: selectedBrand.image || "",
        },
        description: values.description.split("\n").map(s=>s.trim()).filter(s=>s),
        specifications: values.specifications.split("\n").map(s=>s.trim()).filter(s=>s),
        price: values.price,
        images: [],
        variants: await Promise.all(variants.map(async (variant) => {
            const variantData = {
                color: variant.color,
                quantity: variant.quantity,
                sale: variant.sale,
                image: variant.image || "",
            };
            if(variant._id) {
                variantData._id = variant._id;
            }
            return variantData;
        })),
      };
      
      if (updatedProductData.variants.length > 0 && updatedProductData.variants[0].image) {
        updatedProductData.images.push(updatedProductData.variants[0].image);
      }

      console.log("Submitting updated product data:", updatedProductData);

      await apiService.updateProduct(product._id, updatedProductData);
      message.success("Sản phẩm đã được cập nhật thành công!");
      if (typeof onProductUpdated === 'function') {
        onProductUpdated();
      }
    } catch (e) {
      console.error("Lỗi khi cập nhật sản phẩm:", e);
      message.error(e.response?.data?.message || e.message || "Đã xảy ra lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div style={{ overflowY: 'auto', paddingRight: '15px' }}>
      <Form
        form={form}
        layout="vertical"
        name="editProductForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: 16 }}>Thông tin chung</Title>
             <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            >
              <Input placeholder="Ví dụ: iPhone 15 Pro Max" />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                    label="Loại sản phẩm"
                    name="category"
                    rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
                    >
                    <Select
                        placeholder="Chọn loại sản phẩm"
                        loading={loadingCategories}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => 
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {categoriesList.map((cat) => (
                        <Select.Option key={cat} value={cat}>
                            {cat}
                        </Select.Option>
                        ))}
                    </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                    label="Giá gốc"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                    >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        addonAfter="VNĐ"
                    />
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item
              label="Thương hiệu"
              name="brand"
              rules={[{ required: true, message: "Vui lòng chọn thương hiệu!" }]}
            >
              <Select
                placeholder="Chọn thương hiệu"
                showSearch
                filterOption={(input, option) => {
                  const brandName = option?.children?.props?.children[1] || '';
                  return brandName.includes(input);
                }}
              >
                {brandsList.map((brandObj) => (
                  <Select.Option key={brandObj._id} value={brandObj.name}>
                    <Space>
                      {brandObj.image && (
                        <Image 
                          src={brandObj.image} 
                          width={20} 
                          height={20} 
                          preview={false} 
                          style={{ objectFit: 'contain' }} 
                          fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        />
                      )}
                      {brandObj.name}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Mô tả sản phẩm"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập chi tiết mô tả, mỗi ý một dòng..." />
            </Form.Item>

            <Form.Item
              label="Thông số kỹ thuật"
              name="specifications"
              rules={[{ required: true, message: "Vui lòng nhập thông số!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập thông số, mỗi dòng một thông số (VD: RAM: 8GB)..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: 16 }}>
                Quản lý biến thể
                <Tooltip title="Mỗi sản phẩm phải có ít nhất một biến thể.">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: 'rgba(0,0,0,.45)'}}/>
                </Tooltip>
            </Title>
            {variants.map((variant, index) => (
              <Card
                key={variant.key}
                size="small"
                title={`Biến thể ${index + 1}${variant._id ? "" : " (Mới)"}`}
                extra={
                  variants.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeVariant(variant.key)}
                    />
                  )
                }
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  label="Màu sắc"
                  rules={[{ required: true, message: "Màu sắc không được trống!" }]}
                >
                  <Input
                    placeholder="Ví dụ: Xanh dương"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(variant.key, "color", e.target.value)}
                  />
                </Form.Item>
                 <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Số lượng tồn" rules={[{ required: true, message: "Số lượng không được trống!" }]}>
                        <InputNumber
                            min={0} style={{ width: "100%" }}
                            value={variant.quantity}
                            onChange={(value) => handleVariantChange(variant.key, "quantity", value)}
                        />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giảm giá (%)">
                        <InputNumber
                            min={0} max={100} style={{ width: "100%" }}
                            value={variant.sale}
                            onChange={(value) => handleVariantChange(variant.key, "sale", value)}
                            addonAfter="%"
                        />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Ảnh biến thể (URL hoặc Tải lên)">
                  <Input 
                    placeholder="Nhập URL ảnh hoặc để trống nếu tải lên" 
                    value={!variant.imageFile ? variant.image : ''}
                    onChange={(e) => {
                        handleVariantChange(variant.key, "image", e.target.value);
                        if(!e.target.value && variant.imageFile) handleVariantChange(variant.key, "imageFile", null);
                    }}
                    style={{marginBottom: 8}} 
                  />
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleVariantImageUpload(variant.key, file);
                      return false;
                    }}
                    accept="image/*"
                  >
                    {variant.image ? (
                      <Image src={variant.image} alt="variant" style={{ width: '100%', objectFit: 'contain' }} preview={false} />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={addVariant}
              icon={<PlusOutlined />}
              block
            >
              Thêm biến thể khác
            </Button>
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ textAlign: "right", marginTop: 24, marginBottom: 0 }}>
          <Space>
            <Button onClick={closeModal}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={form.getFieldValue('loading') || loadingCategories || loadingBrands}>
              Lưu Thay Đổi
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;