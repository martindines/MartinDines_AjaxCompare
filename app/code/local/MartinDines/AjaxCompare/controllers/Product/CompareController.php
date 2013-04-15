<?php

require_once 'Mage/Catalog/controllers/Product/CompareController.php';

class MartinDines_AjaxCompare_Product_CompareController extends Mage_Catalog_Product_CompareController
{
    /**
     * Handle Add To Compare if request made via Ajax
     */
    public function addAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {

            $json = array();

            if ($productId = (int) $this->getRequest()->getParam('product')) {

                $product = Mage::getModel('catalog/product')
                    ->setStoreId(Mage::app()->getStore()->getId())
                    ->load($productId);

                if ($product->getId()) {
                    Mage::getSingleton('catalog/product_compare_list')->addProduct($product);
                    Mage::dispatchEvent('catalog_product_compare_add_product', array('product' => $product));
                    Mage::helper('catalog/product_compare')->calculate();

                    $json = array('success' => true);
                } else {
                    $json = array(
                        'success' => false,
                        'message' => 'Product ID ' . $productId . ' not found',
                    );
                }

            } else {
                $json = array(
                    'success' => false,
                    'message' => 'Product ID required',
                );
            }

            $jsonResponse = Mage::helper('core')->jsonEncode($json);

            $this->getResponse()->setHeader('Content-type', 'application/json');
            $this->getResponse()->setBody($jsonResponse);

        } else {
            parent::addAction();
        }
    }
}