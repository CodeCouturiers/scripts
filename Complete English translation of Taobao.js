// ==UserScript==
// @name         Complete English translation of Taobao
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Complete English translation of Taobao
// @author       Your name
// @match        *://*.taobao.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const translations = {
        // Top menu and navigation
        "请登录": "Sign In",
        "手机逛淘宝": "Mobile App",
        "淘宝网首页": "Home",
        "我的淘宝": "My Taobao",
        "购物车": "Cart",
        "收藏夹": "Favorites",
        "商品分类": "Product Categories",
        "免费开店": "Open a Store",
        "联系客服": "Contact Customer Service",
        "网站导航": "Website Navigation",
        "亲，请登录": "Please sign in",

        // Personal account
        "我的足迹": "My Browsing History",
        "已买到的宝贝": "My Orders",
        "我的购物车": "My Cart",
        "购买过的店铺": "Purchase History",
        "收藏的宝贝": "Favorite Products",
        "收藏的店铺": "Favorite Stores",
        "我的卡券包": "My Coupons",
        "我的发票": "My Invoices",
        "评价管理": "My Reviews",
        "账号设置": "Account Settings",
        "安全设置": "Security Settings",
        "个人资料": "Personal Information",
        "账号绑定": "Account Binding",
        "支付宝绑定": "Bind Alipay",
        "所有订单": "All Orders",
        "待付款": "Awaiting Payment",
        "待发货": "Awaiting Shipment",
        "待收货": "Awaiting Delivery",
        "待评价": "Awaiting Review",
        "分阶段": "Phased",
        "订单回收站": "Order Trash",
        "再次购买": "Buy Again",
        "订单号": "Order Number",
        "我的收藏": "My Favorites",
        "我的拍卖": "My Auctions",
        "官方集运": "Official Logistics",
        "网页无障碍": "Accessibility",
        "账号管理": "Account Management",
        "退出": "Sign Out",
        "淘气值": "Taobao Points",
        "普通会员": "Regular User",
        "查看你的专属权益": "View Your Exclusive Benefits",
        "修改头像、昵称": "Change Avatar and Nickname",
        "修改登录密码": "Change Login Password",
        "手机绑定": "Bind Mobile",
        "密保问题设置": "Security Question Settings",
        "其他": "Other",
        "千牛卖家中心": "Qianniu Seller Center",
        "开店入驻": "Join as a Seller",
        "已卖出的Товар": "Sold Products",
        "出售中的Товar": "Products on Sale",
        "卖家服务": "Seller Services",
        "市场": "Marketplace",
        "卖家培训中心": "Seller Training Center",
        "体检中心": "Inspection Center",
        "电商学习中心": "E-commerce Learning Center",

        // Product actions
        "商品操作": "Product Actions",

        // Product
        "宝贝": "Product",

        // Order actions
        "交易操作": "Order Actions",

        // Order status
        "交易状态": "Order Status",
        "等待买家付款": "Awaiting Buyer Payment",
        "付款确认中": "Payment Confirmation",
        "买家已付款": "Paid by Buyer",

        // Order statuses
        "交易成功": "Order Completed",
        "等待付款": "Awaiting Payment",
        "等待发货": "Processing",
        "等待收货": "In Delivery",
        "等待评价": "Awaiting Review",
        "交易关闭": "Order Cancelled",
        "退款中": "Refund",
        "交易异常": "Order Issue",
        "交易已关闭": "Order Closed",

        // Order details
        "订单详情": "Order Details",
        "收货地址": "Delivery Address",
        "实付款": "Total Amount",
        "运费": "Shipping Fee",
        "优惠": "Discount",
        "数量": "Quantity",
        "单价": "Unit Price",
        "合计": "Total",

        // Order actions
        "申请售后": "Request Return/Refund",
        "查看详情": "View Details",
        "删除订单": "Delete Order",
        "投诉卖家": "Complain About Seller",
        "确认收货": "Confirm Delivery",
        "立即付款": "Pay Now",
        "追加评论": "Add Review",
        "取消订单": "Cancel Order",
        "申请开票": "Request Invoice",
        "查看物流": "Track Delivery",
        "双方已评": "Both Parties Reviewed",
        "违规举报": "Report Violation",

        // Product specifications
        "颜色分类": "Color",
        "尺码": "Size",
        "型号": "Model",
        "规格": "Specifications",
        "款式": "Style",
        "材质": "Material",

        // Delivery information
        "物流信息": "Delivery Information",
        "运单号": "Tracking Number",
        "已发货": "Shipped",
        "运输中": "In Transit",
        "已签收": "Delivered",
        "暂无物流信息": "No Delivery Information",

        // Messages and notifications
        "消息": "Messages",
        "系统通知": "System Notifications",
        "交易物流": "Order Logistics",
        "商家通知": "Seller Notifications",
        "活动消息": "Promotions",
        "全部消息": "All Messages",

        // Additional functions
        "退款维权": "Disputes and Refunds",
        "退款/退货": "Refund/Return",
        "投诉管理": "Complaints",
        "举报管理": "Violations",
        "安全设置": "Security",
        "账户设置": "Profile Settings",
        "绑定手机": "Bind Mobile",
        "支付宝账户": "Alipay Account",
        "全部功能": "All Functions",

        // Search and filters
        "搜索": "Search",
        "筛选": "Filter",
        "价格": "Price",
        "销量": "Sales",
        "信用": "Reputation",
        "综合排序": "Sort By",

        // Action buttons
        "确定": "Confirm",
        "取消": "Cancel",
        "保存": "Save",
        "编辑": "Edit",
        "删除": "Delete",
        "关闭": "Close",
        "提交": "Submit",

        // Footer and other
        "帮助中心": "Help Center",
        "联系我们": "Contact Us",
        "意见反馈": "Feedback",
        "返回顶部": "Back to Top",
        "首页": "Home",
        "更多": "More"
    };

    // Function to safely replace text without affecting JS
    function safeTranslate(node) {
        if (node.nodeType === 3) { // Text node
            let text = node.nodeValue;
            let translated = false;

            for (let [key, value] of Object.entries(translations)) {
                if (text.includes(key)) {
                    text = text.replace(new RegExp(key, 'g'), value);
                    translated = true;
                }
            }

            if (translated) {
                node.nodeValue = text;
            }
        } else if (node.nodeType === 1) { // Element
            // Skip scripts and styles
            if (node.nodeName !== 'SCRIPT' &&
                node.nodeName !== 'STYLE' &&
                !node.classList.contains('no-translate')) {

                // Translate title and placeholder if present
                if (node.hasAttribute('title')) {
                    let title = node.getAttribute('title');
                    for (let [key, value] of Object.entries(translations)) {
                        if (title.includes(key)) {
                            node.setAttribute('title', title.replace(key, value));
                        }
                    }
                }

                if (node.hasAttribute('placeholder')) {
                    let placeholder = node.getAttribute('placeholder');
                    for (let [key, value] of Object.entries(translations)) {
                        if (placeholder.includes(key)) {
                            node.setAttribute('placeholder', placeholder.replace(key, value));
                        }
                    }
                }

                // Recursively process child nodes
                Array.from(node.childNodes).forEach(safeTranslate);
            }
        }
    }

    // Function to start the translation
    function startTranslation() {
        safeTranslate(document.body);
    }

    // Observer for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        safeTranslate(node);
                    }
                });
            }
        });
    });

    // Start the observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Start the initial translation
    startTranslation();

    // Periodically check for new elements
    setInterval(startTranslation, 2000);

})();
