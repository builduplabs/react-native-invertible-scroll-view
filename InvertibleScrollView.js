'use strict';

import React, {
  PropTypes,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

import cloneReferencedElement from 'react-clone-referenced-element';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

const verticalTransform = [
  { scaleY: -1 },
];

const horizontalTransform = [
  { scaleX: -1 },
];

if (Platform.OS === 'android') {
  verticalTransform.push({
    perspective: 1280,
  });
  horizontalTransform.push({
    perspective: 1280,
  })
}

let InvertibleScrollView = React.createClass({
  mixins: [ScrollableMixin],

  propTypes: {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  },

  getScrollResponder(): ReactComponent {
    return this._scrollComponent.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
  },

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },
});

// let styles = StyleSheet.create({
//   verticallyInverted: {
//     transform: verticalTransform,
//   },
//   horizontallyInverted: {
//     transform: horizontalTransform,
//   },
// });

let styles = StyleSheet.create({
  verticallyInverted: Platform.select({
    ios: {
      flex: 1,
      transform: [
        { scaleY: -1 },
      ],
    },
    android: {
      flex: 1,
      scaleY: -1,
    },
  }),
  horizontallyInverted: Platform.select({
    ios: {
      flex: 1,
      transform: [
        { scaleX: -1 },
      ],
    },
    android: {
      flex: 1,
      scaleX: -1,
    },
  }),
});

module.exports = InvertibleScrollView;
