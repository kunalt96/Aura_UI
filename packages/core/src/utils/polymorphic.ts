import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from 'react';

export type PolymorphicRef<C extends ElementType> = Ref<
  C extends keyof React.JSX.IntrinsicElements
    ? React.ComponentRef<C>
    : React.ComponentRef<C>
>;

export type PolymorphicProps<C extends ElementType, OwnProps = object> = OwnProps & {
  as?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | 'as'>;

export type PolymorphicPropsWithRef<C extends ElementType, OwnProps = object> = PolymorphicProps<
  C,
  OwnProps
> & {
  ref?: PolymorphicRef<C> | undefined;
};

export type PolymorphicComponent<DefaultElement extends ElementType, OwnProps = object> = {
  <C extends ElementType = DefaultElement>(
    props: PolymorphicPropsWithRef<C, OwnProps>,
  ): ReactElement | null;
  displayName?: string | undefined;
};
