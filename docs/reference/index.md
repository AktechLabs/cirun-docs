import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

# Reference

<DocCardList items={useCurrentSidebarCategory().items}/>
