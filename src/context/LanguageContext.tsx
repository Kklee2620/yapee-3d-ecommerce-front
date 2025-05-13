
import { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'vi' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  changeLanguage: (language: Language) => void; 
  t: (key: string, params?: Record<string, any>) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.search': 'Search products...',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.language': 'Language',
    'nav.selectLanguage': 'Select Language',
    'nav.menu': 'Menu',
    'nav.profile': 'Profile',
    'nav.orders': 'Orders',
    'nav.logout': 'Logout',
    'nav.searchPlaceholder': 'Search for products...',
    
    // Homepage
    'home.hero.title': 'Experience Safe and Secure Shopping',
    'home.hero.subtitle': 'Yapee - Trust and Security is our priority',
    'home.hero.cta': 'Explore Now',
    'home.featured': 'Featured Products',
    'home.newArrivals': 'New Arrivals',
    'home.bestsellers': 'Bestsellers',
    'home.viewAll': 'View All',
    'home.about.title': 'About Yapee',
    'home.about.description': 'Yapee is your trusted online marketplace focused on providing a secure and reliable shopping experience. We verify all sellers and products to ensure you receive exactly what you pay for.',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.description': 'Product Description',
    'product.specifications': 'Specifications',
    'product.reviews': 'Reviews',
    'product.related': 'Related Products',
    'product.color': 'Color',
    'product.size': 'Size',
    'product.quantity': 'Quantity',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.sku': 'SKU',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Looks like you haven\'t added anything to your cart yet.',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.remove': 'Remove',
    'cart.update': 'Update',
    'cart.items': '{count} items',
    'cart.calculated': 'Calculated at checkout',
    'cart.removeItem': 'Remove item',
    'cart.loginToCheckout': 'Login to Checkout',
    'cart.yourCart': 'Your Cart',
    
    // Footer
    'footer.about': 'About Yapee',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.support': 'Customer Support',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.newsletter': 'Subscribe to our newsletter',
    'footer.subscribeButton': 'Subscribe',
    'footer.copyright': '© 2025 Yapee. All rights reserved.',
    'footer.paymentMethods': 'Payment Methods',
    
    // Error Pages
    'error.pageNotFound': 'Oops! Page not found',
    'error.pageNotFoundMessage': 'The page you are looking for might have been removed or is temporarily unavailable.',
    'error.returnHome': 'Return to Home',
    'error.title': 'Error',
    'error.fetchAddresses': 'Failed to fetch addresses',
    'error.addAddress': 'Failed to add address',
    'error.deleteAddress': 'Failed to delete address',
    'error.setDefaultAddress': 'Failed to set default address',
    
    // Profile & Addresses
    'profile.addresses': 'My Addresses',
    'profile.address': 'Address',
    'profile.defaultAddress': 'Default',
    'profile.noAddresses': 'You have no saved addresses',
    'profile.addNewAddress': 'Add New Address',
    'profile.addNewAddressDescription': 'Add a new shipping address to your account',
    'profile.addressLine': 'Address Line',
    'profile.city': 'City',
    'profile.country': 'Country',
    'profile.setAsDefault': 'Set as Default Address',
    
    // General Actions
    'actions.save': 'Save',
    'actions.cancel': 'Cancel',
    'actions.delete': 'Delete',
    'actions.edit': 'Edit',
    
    // Success Messages
    'success.title': 'Success',
    'success.addressAdded': 'Address added successfully',
    'success.addressDeleted': 'Address deleted successfully',
    'success.defaultAddressSet': 'Default address updated successfully',
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Về chúng tôi',
    'nav.contact': 'Liên hệ',
    'nav.search': 'Tìm kiếm sản phẩm...',
    'nav.cart': 'Giỏ hàng',
    'nav.account': 'Tài khoản',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.language': 'Ngôn ngữ',
    'nav.selectLanguage': 'Chọn ngôn ngữ',
    'nav.menu': 'Menu',
    'nav.profile': 'Hồ sơ',
    'nav.orders': 'Đơn hàng',
    'nav.logout': 'Đăng xuất',
    'nav.searchPlaceholder': 'Tìm kiếm sản phẩm...',
    
    // Homepage
    'home.hero.title': 'Trải nghiệm mua sắm an toàn và bảo mật',
    'home.hero.subtitle': 'Yapee - Uy tín và Bảo mật là ưu tiên của chúng tôi',
    'home.hero.cta': 'Khám phá ngay',
    'home.featured': 'Sản phẩm nổi bật',
    'home.newArrivals': 'Hàng mới về',
    'home.bestsellers': 'Bán chạy nhất',
    'home.viewAll': 'Xem tất cả',
    'home.about.title': 'Về Yapee',
    'home.about.description': 'Yapee là sàn thương mại điện tử đáng tin cậy của bạn, tập trung vào việc cung cấp trải nghiệm mua sắm an toàn và đáng tin cậy. Chúng tôi xác minh tất cả người bán và sản phẩm để đảm bảo bạn nhận được đúng những gì bạn trả tiền.',
    
    // Product
    'product.addToCart': 'Thêm vào giỏ',
    'product.buyNow': 'Mua ngay',
    'product.description': 'Mô tả sản phẩm',
    'product.specifications': 'Thông số kỹ thuật',
    'product.reviews': 'Đánh giá',
    'product.related': 'Sản phẩm liên quan',
    'product.color': 'Màu sắc',
    'product.size': 'Kích thước',
    'product.quantity': 'Số lượng',
    'product.inStock': 'Còn hàng',
    'product.outOfStock': 'Hết hàng',
    'product.sku': 'Mã sản phẩm',
    
    // Cart
    'cart.title': 'Giỏ hàng của bạn',
    'cart.empty': 'Giỏ hàng trống',
    'cart.emptyMessage': 'Có vẻ như bạn chưa thêm bất cứ thứ gì vào giỏ hàng.',
    'cart.continueShopping': 'Tiếp tục mua sắm',
    'cart.checkout': 'Thanh toán',
    'cart.total': 'Tổng cộng',
    'cart.subtotal': 'Tạm tính',
    'cart.shipping': 'Phí vận chuyển',
    'cart.tax': 'Thuế',
    'cart.remove': 'Xóa',
    'cart.update': 'Cập nhật',
    'cart.items': '{count} sản phẩm',
    'cart.calculated': 'Được tính khi thanh toán',
    'cart.removeItem': 'Xóa sản phẩm',
    'cart.loginToCheckout': 'Đăng nhập để thanh toán',
    'cart.yourCart': 'Giỏ hàng của bạn',
    
    // Footer
    'footer.about': 'Về Yapee',
    'footer.terms': 'Điều khoản & Điều kiện',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.support': 'Hỗ trợ khách hàng',
    'footer.contact': 'Liên hệ với chúng tôi',
    'footer.followUs': 'Theo dõi chúng tôi',
    'footer.newsletter': 'Đăng ký nhận bản tin',
    'footer.subscribeButton': 'Đăng ký',
    'footer.copyright': '© 2025 Yapee. Tất cả quyền được bảo lưu.',
    'footer.paymentMethods': 'Phương thức thanh toán',
    
    // Error Pages
    'error.pageNotFound': 'Rất tiếc! Không tìm thấy trang',
    'error.pageNotFoundMessage': 'Trang bạn đang tìm kiếm có thể đã bị xóa hoặc tạm thời không khả dụng.',
    'error.returnHome': 'Quay lại Trang chủ',
    'error.title': 'Lỗi',
    'error.fetchAddresses': 'Không thể tải danh sách địa chỉ',
    'error.addAddress': 'Không thể thêm địa chỉ mới',
    'error.deleteAddress': 'Không thể xóa địa chỉ',
    'error.setDefaultAddress': 'Không thể đặt địa chỉ mặc định',
    
    // Profile & Addresses
    'profile.addresses': 'Địa chỉ của tôi',
    'profile.address': 'Địa chỉ',
    'profile.defaultAddress': 'Mặc định',
    'profile.noAddresses': 'Bạn chưa có địa chỉ nào được lưu',
    'profile.addNewAddress': 'Thêm địa chỉ mới',
    'profile.addNewAddressDescription': 'Thêm địa chỉ giao hàng mới vào tài khoản của bạn',
    'profile.addressLine': 'Địa chỉ',
    'profile.city': 'Thành phố',
    'profile.country': 'Quốc gia',
    'profile.setAsDefault': 'Đặt làm địa chỉ mặc định',
    
    // General Actions
    'actions.save': 'Lưu',
    'actions.cancel': 'Hủy',
    'actions.delete': 'Xóa',
    'actions.edit': 'Sửa',
    
    // Success Messages
    'success.title': 'Thành công',
    'success.addressAdded': 'Đã thêm địa chỉ thành công',
    'success.addressDeleted': 'Đã xóa địa chỉ thành công',
    'success.defaultAddressSet': 'Đã cập nhật địa chỉ mặc định thành công',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.products': '产品',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.search': '搜索产品...',
    'nav.cart': '购物车',
    'nav.account': '账户',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.language': '语言',
    'nav.selectLanguage': '选择语言',
    'nav.menu': '菜单',
    'nav.profile': '个人资料',
    'nav.orders': '订单',
    'nav.logout': '退出登录',
    'nav.searchPlaceholder': '搜索产品...',
    
    // Homepage
    'home.hero.title': '体验安全可靠的购物',
    'home.hero.subtitle': 'Yapee - 信任和安全是我们的优先事项',
    'home.hero.cta': '立即探索',
    'home.featured': '精选产品',
    'home.newArrivals': '新品到达',
    'home.bestsellers': '畅销产品',
    'home.viewAll': '查看全部',
    'home.about.title': '关于 Yapee',
    'home.about.description': 'Yapee 是您值得信赖的在线市场，专注于提供安全可靠的购物体验。我们验证所有卖家和产品，以确保您收到您所支付的确切商品。',
    
    // Product
    'product.addToCart': '加入购物车',
    'product.buyNow': '立即购买',
    'product.description': '产品描述',
    'product.specifications': '规格',
    'product.reviews': '评价',
    'product.related': '相关产品',
    'product.color': '颜色',
    'product.size': '尺寸',
    'product.quantity': '数量',
    'product.inStock': '有库存',
    'product.outOfStock': '缺货',
    'product.sku': '产品编号',
    
    // Cart
    'cart.title': '您的购物车',
    'cart.empty': '购物车是空的',
    'cart.emptyMessage': '看起来您还没有添加任何商品到购物车。',
    'cart.continueShopping': '继续购物',
    'cart.checkout': '结账',
    'cart.total': '总计',
    'cart.subtotal': '小计',
    'cart.shipping': '运费',
    'cart.tax': '税费',
    'cart.remove': '移除',
    'cart.update': '更新',
    'cart.items': '{count} 件商品',
    'cart.calculated': '结账时计算',
    'cart.removeItem': '移除商品',
    'cart.loginToCheckout': '登录以结账',
    'cart.yourCart': '您的购物车',
    
    // Footer
    'footer.about': '关于 Yapee',
    'footer.terms': '条款和条件',
    'footer.privacy': '隐私政策',
    'footer.support': '客户支持',
    'footer.contact': '联系我们',
    'footer.followUs': '关注我们',
    'footer.newsletter': '订阅我们的新闻通讯',
    'footer.subscribeButton': '订阅',
    'footer.copyright': '© 2025 Yapee. 保留所有权利。',
    'footer.paymentMethods': '支付方式',
    
    // Error Pages
    'error.pageNotFound': '哎呀！找不到页面',
    'error.pageNotFoundMessage': '您正在寻找的页面可能已被删除或暂时不可用。',
    'error.returnHome': '返回首页',
    'error.title': '错误',
    'error.fetchAddresses': '无法获取地址',
    'error.addAddress': '无法添加地址',
    'error.deleteAddress': '无法删除地址',
    'error.setDefaultAddress': '无法设置默认地址',
    
    // Profile & Addresses
    'profile.addresses': '我的地址',
    'profile.address': '地址',
    'profile.defaultAddress': '默认',
    'profile.noAddresses': '您还没有保存任何地址',
    'profile.addNewAddress': '添加新地址',
    'profile.addNewAddressDescription': '向您的账户添加新的收货地址',
    'profile.addressLine': '地址行',
    'profile.city': '城市',
    'profile.country': '国家',
    'profile.setAsDefault': '设为默认地址',
    
    // General Actions
    'actions.save': '保存',
    'actions.cancel': '取消',
    'actions.delete': '删除',
    'actions.edit': '编辑',
    
    // Success Messages
    'success.title': '成功',
    'success.addressAdded': '地址添加成功',
    'success.addressDeleted': '地址删除成功',
    'success.defaultAddressSet': '默认地址更新成功',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, any>) => {
    let text = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    // Replace parameters in the translation if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return text;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
