<?php

class MartinDines_AjaxCompare_Block_Messages extends Mage_Core_Block_Messages
{
    /**
     * Wrap messages in custom div (that will always be present) so it can easily be targetted by javascript
     * @return  string
     */
    public function getGroupedHtml()
    {
        $wrapper = '<div id="%s-container" class="ajax-message-container">%s</div>';
        return sprintf($wrapper, $this->getNameInLayout(), parent::getGroupedHtml());
    }
}
