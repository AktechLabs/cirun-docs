import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  findFirstCategoryLink,
  useDocById,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

function CardLayout({href, title, description}) {
  return (
    <Link href={href} className={clsx('card', styles.cardContainer)}>
      <h2 className={styles.cardTitle} title={title}>
        {title}
      </h2>
      {description && (
        <p className={styles.cardDescription} title={description}>
          {description}
        </p>
      )}
    </Link>
  );
}

function CardCategory({item}) {
  const href = findFirstCategoryLink(item);
  if (!href) return null;
  return (
    <CardLayout
      href={href}
      title={item.label}
      description={
        item.description ??
        translate(
          {
            message: '{count} items',
            id: 'theme.docs.DocCard.categoryDescription',
          },
          {count: item.items.length},
        )
      }
    />
  );
}

function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
