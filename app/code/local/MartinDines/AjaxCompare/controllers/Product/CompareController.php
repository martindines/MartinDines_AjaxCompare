<?php
/**
 * @category    MartinDines
 * @package     MartinDines_AjaxCompare
 * @author      Martin Dines <martin.dines@live.co.uk>
 */
require_once 'Mage/Catalog/controllers/Product/CompareController.php';

class MartinDines_AjaxCompare_Product_CompareController extends Mage_Catalog_Product_CompareController
{
    private function _initCustomHandler()
    {
        $this->getLayout()->getUpdate()
            ->addHandle(strtolower($this->getFullActionName()));
        $this->loadLayoutUpdates()->generateLayoutXml()->generateLayoutBlocks();
    }

    public function get_messagesAction()
    {
        $this->_initCustomHandler();
        $this->_initLayoutMessages('catalog/session');

        if ($this->getRequest()->isXmlHttpRequest()) {
            $messagesBlock = $this->getLayout()->getMessagesBlock();
            echo $messagesBlock->getGroupedHtml();
        } else {
            $this->getResponse()->setHeader('HTTP/1.1','403 Forbidden');
            $this->getResponse()->setHeader('Status','403 Forbidden');
            exit('Forbidden');
        }
    }

    public function get_sidebar_compareAction()
    {
        $this->_initCustomHandler();

        if ($this->getRequest()->isXmlHttpRequest()) {
            $messagesBlock = $this->getLayout()->getBlock('catalog.compare.sidebar');
            echo $messagesBlock->toHtml();
        } else {
            $this->getResponse()->setHeader('HTTP/1.1','403 Forbidden');
            $this->getResponse()->setHeader('Status','403 Forbidden');
            exit('Forbidden');
        }
    }

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
                    Mage::getSingleton('catalog/session')->addSuccess(
                        $this->__('The product %s has been added to comparison list.', Mage::helper('core')->escapeHtml($product->getName()))
                    );
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

    public function removeAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {

            $json = array();

            if ($productId = (int) $this->getRequest()->getParam('product')) {

                $product = Mage::getModel('catalog/product')
                    ->setStoreId(Mage::app()->getStore()->getId())
                    ->load($productId);

                if($product->getId()) {
                    /** @var $item Mage_Catalog_Model_Product_Compare_Item */
                    $item = Mage::getModel('catalog/product_compare_item');
                    if (Mage::getSingleton('customer/session')->isLoggedIn()) {
                        $item->addCustomerData(Mage::getSingleton('customer/session')->getCustomer());
                    } elseif ($this->_customerId) {
                        $item->addCustomerData(
                            Mage::getModel('customer/customer')->load($this->_customerId)
                        );
                    } else {
                        $item->addVisitorId(Mage::getSingleton('log/visitor')->getId());
                    }

                    $item->loadByProduct($product);

                    if ($item->getId()) {
                        $item->delete();
                        Mage::getSingleton('catalog/session')->addSuccess(
                            $this->__('The product %s has been removed from comparison list.', Mage::helper('core')->escapeHtml($product->getName()))
                        );
                        Mage::dispatchEvent('catalog_product_compare_remove_product', array('product'=>$item));
                        Mage::helper('catalog/product_compare')->calculate();
                        $json = array('success' => true);
                    } else {
                        $json = array(
                            'success' => false,
                            'message' => 'Product ID ' . $productId . ' not found',
                        );
                    }

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
            parent::removeAction();
        }

    }

    public function clearAction()
    {
        // @todo currently returns success = true regardless of whether removing products was successful or not. Reevaluate
        if ($this->getRequest()->isXmlHttpRequest()) {

            $json = array();

            $items = Mage::getResourceModel('catalog/product_compare_item_collection');

            if (Mage::getSingleton('customer/session')->isLoggedIn()) {
                $items->setCustomerId(Mage::getSingleton('customer/session')->getCustomerId());
            } elseif ($this->_customerId) {
                $items->setCustomerId($this->_customerId);
            } else {
                $items->setVisitorId(Mage::getSingleton('log/visitor')->getId());
            }

            /** @var $session Mage_Catalog_Model_Session */
            $session = Mage::getSingleton('catalog/session');

            try {
                $items->clear();
                $session->addSuccess($this->__('The comparison list was cleared.'));
                Mage::helper('catalog/product_compare')->calculate();
            } catch (Mage_Core_Exception $e) {
                $session->addError($e->getMessage());
            } catch (Exception $e) {
                $session->addException($e, $this->__('An error occurred while clearing comparison list.'));
            }

            $json = array('success' => true);
            $jsonResponse = Mage::helper('core')->jsonEncode($json);

            $this->getResponse()->setHeader('Content-type', 'application/json');
            $this->getResponse()->setBody($jsonResponse);

        } else {
            parent::removeAction();
        }
    }
}