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
  Modal,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import apiService from "../../api/api";

const { Title } = Typography;

const AddProduct = ({ closeModal, onProductAdded }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([
    { key: Date.now(), color: "", quantity: 0, sale: 0, image: "", imageFile: null },
  ]);

  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [isAddBrandModalVisible, setIsAddBrandModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState({ name: "", image: "" });

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      setLoadingCategories(true);
      setLoadingBrands(true);
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          apiService.getAllCategories(),
          apiService.getAllBrands()
        ]);
        
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
          setCategoriesList(categoriesResponse.data.categories);
        } else {
          message.error("Không thể tải danh sách loại sản phẩm.");
        }

        if (brandsResponse.data && Array.isArray(brandsResponse.data.brands)) {
          setBrandsList(brandsResponse.data.brands);
        } else {
          message.error("Không thể tải danh sách thương hiệu.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Lỗi khi tải danh sách loại sản phẩm và thương hiệu.");
      } finally {
        setLoadingCategories(false);
        setLoadingBrands(false);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại các trường thông tin!");
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { key: Date.now(), color: "", quantity: 0, sale: 0, image: "", imageFile: null },
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
    setIsSubmitting(true);
    try {
      const selectedFullBrand = brandsList.find(b => b.name === values.brand);
      
      if (!selectedFullBrand) {
          message.error("Thương hiệu đã chọn không hợp lệ. Vui lòng làm mới và chọn lại.");
          setIsSubmitting(false);
          return;
      }

      const productData = {
        name: values.name,
        category: values.category,
        brand: {
          name: selectedFullBrand.name,
          image: selectedFullBrand.image || "",
        },
        description: values.description.split("\n").map(s => s.trim()).filter(s => s),
        specifications: values.specifications.split("\n").map(s => s.trim()).filter(s => s),
        price: values.price,
        images: [],
        variants: variants.map(variant => ({
            color: variant.color,
            quantity: variant.quantity,
            sale: variant.sale,
            image: variant.image || "",
        })),
      };
      
      if (productData.variants.length > 0 && productData.variants[0].image) {
        productData.images.push(productData.variants[0].image);
      }
      
      console.log("Submitting product data:", productData);

      await apiService.createProduct(productData);
      message.success("Sản phẩm đã được thêm thành công!");
      if (typeof onProductAdded === 'function') {
        onProductAdded();
      }
    } catch (e) {
      console.error("Lỗi khi thêm sản phẩm:", e);
      message.error(e.response?.data?.message || e.message || "Đã xảy ra lỗi khi thêm sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await apiService.addCategory({ categoryName: newCategory });
      setCategoriesList([...categoriesList, response.data.categoryName]);
      form.setFieldsValue({ category: response.data.categoryName });
      setIsAddCategoryModalVisible(false);
      message.success("Đã thêm loại sản phẩm mới thành công!");
    } catch (error) {
      message.error("Lỗi khi thêm loại sản phẩm mới: " + error.message);
    }
  };

  const handleAddBrand = async () => {
    try {
      const response = await apiService.addBrand(newBrand);
      setBrandsList([...brandsList, response.data]);
      form.setFieldsValue({ brand: response.data.name });
      setIsAddBrandModalVisible(false);
      message.success("Đã thêm thương hiệu mới thành công!");
    } catch (error) {
      message.error("Lỗi khi thêm thương hiệu mới: " + error.message);
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '0 15px 15px 0' }}>
      <Form
        form={form}
        layout="vertical"
        name="addProductForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ 
            price: 0, 
            brand: undefined
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>Thông tin chung</Title>
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
                      (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    allowClear
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Button type="text" icon={<PlusOutlined />} onClick={() => setIsAddCategoryModalVisible(true)}>
                            Thêm loại sản phẩm mới
                          </Button>
                        </Space>
                      </>
                    )}
                  >
                    {categoriesList.map((cat) => (
                      <Select.Option key={cat} value={cat}>{cat}</Select.Option>
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
                    parser={(value) => value.replace(/VNĐ\s?|(,*)/g, "")}
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
                loading={loadingBrands}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children?.props?.children[1] ?? '').toLowerCase().includes(input.toLowerCase())
                }
                allowClear
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Button type="text" icon={<PlusOutlined />} onClick={() => setIsAddBrandModalVisible(true)}>
                        Thêm thương hiệu mới
                      </Button>
                    </Space>
                  </>
                )}
              >
                {brandsList.map((brandObj) => (
                  <Select.Option key={brandObj._id} value={brandObj.name}>
                    <Space>
                        {brandObj.image && <Image src={brandObj.image} width={20} height={20} preview={false} style={{ objectFit: 'contain' }} fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>}
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
              <Input.TextArea rows={5} placeholder="Nhập chi tiết mô tả sản phẩm, mỗi ý một dòng để xuống hàng..." />
            </Form.Item>

            <Form.Item
              label="Thông số kỹ thuật"
              name="specifications"
              rules={[{ required: true, message: "Vui lòng nhập thông số!" }]}
            >
              <Input.TextArea rows={5} placeholder="Nhập thông số kỹ thuật, ví dụ: RAM: 8GB (mỗi dòng một thông số)..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                Quản lý biến thể
                <Tooltip title="Mỗi sản phẩm phải có ít nhất một biến thể.">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: 'rgba(0,0,0,.45)'}}/>
                </Tooltip>
            </Title>
            {variants.map((variant, index) => (
              <Card
                key={variant.key}
                size="small"
                title={`Biến thể ${index + 1}`}
                extra={
                  variants.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeVariant(variant.key)}
                      style={{padding: '0 8px'}}
                    />
                  )
                }
                style={{ marginBottom: 16, background: '#fafafa' }}
                bodyStyle={{padding: 16}}
              >
                <Form.Item
                  label="Màu sắc / Tên biến thể"
                  rules={[{ required: true, message: "Màu sắc hoặc tên biến thể không được trống!" }]}
                >
                  <Input
                    placeholder="Ví dụ: Xanh Titan, 128GB"
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
                            placeholder="0"
                        />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giảm giá (%)">
                        <InputNumber
                            min={0} max={100} style={{ width: "100%" }}
                            value={variant.sale}
                            onChange={(value) => handleVariantChange(variant.key, "sale", value)}
                            placeholder="0"
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
                        if (variant.imageFile) handleVariantChange(variant.key, "imageFile", null);
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
                      <Image src={variant.image} alt="variant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} preview={false} />
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

        <Divider style={{ marginTop: 24, marginBottom: 16 }}/>

        <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
          <Space>
            <Button onClick={closeModal}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting || loadingCategories || loadingBrands}>
              Thêm Sản Phẩm
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title="Thêm loại sản phẩm mới"
        visible={isAddCategoryModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setIsAddCategoryModalVisible(false)}
      >
        <Input
          placeholder="Nhập tên loại sản phẩm mới"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

      <Modal
        title="Thêm thương hiệu mới"
        visible={isAddBrandModalVisible}
        onOk={handleAddBrand}
        onCancel={() => setIsAddBrandModalVisible(false)}
      >
        <Input
          placeholder="Nhập tên thương hiệu mới"
          value={newBrand.name}
          onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Nhập URL ảnh thương hiệu (tùy chọn)"
          value={newBrand.image}
          onChange={(e) => setNewBrand({ ...newBrand, image: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default AddProduct;