import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { defaultShadow } from '../constants';
import { TabHeight } from './Tabs';
import Interactable from 'react-native-interactable';
import ProfileCardContent, {
  ProfileCardContentProps,
} from './ProfileCardContent';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from './Icon';
import { FastVibrate } from '../utils';

const WindowHeight = Dimensions.get('screen').height;
const WindowWidth = Dimensions.get('screen').width;
const BottomMargin = 150;

type DiscardDirection = 'left' | 'right' | 'center';
export interface ProfileCardProps extends ProfileCardContentProps {
  onSwipe?: (direction: DiscardDirection) => void;
}
export default function ProfileCardView(props: ProfileCardProps) {
  const containerHeight = WindowHeight - TabHeight - BottomMargin;
  const inputRanges = [
    -(WindowWidth + WindowWidth / 2),
    0,
    WindowWidth + WindowWidth / 2,
  ];
  const snapPoints = [
    { id: 'left', x: inputRanges[0] },
    { id: 'center', x: inputRanges[1], damping: 0.5 },
    { id: 'right', x: inputRanges[2] },
  ];

  const scale = useRef(new Animated.Value(0)).current;

  // Start mount animation
  useEffect(() => {
    Animated.timing(scale, {
      easing: Easing.elastic(1),
      duration: 200,
      useNativeDriver: true,
      toValue: 1,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //

  const deltaX = useRef(new Animated.Value(0)).current;
  const deltaY = useRef(new Animated.Value(0)).current;
  var cardRef = useRef<any>().current;
  const [viewType, setViewType] = useState<'card' | 'page'>('card');

  // Vibrate on change of view type
  useEffect(() => {
    setTimeout(_ => {
      FastVibrate();
    }, 50);
  }, []);

  const rotation = deltaX.interpolate({
    inputRange: inputRanges,
    outputRange: ['-40deg', '0deg', '40deg'],
  });

  const iconScale = deltaX.interpolate({
    inputRange: inputRanges,
    outputRange: [2, 0, 2],
  });

  function handleLike() {
    if (cardRef) {
      cardRef.snapTo({ index: 2 });
    }
  }

  function handleDislike() {
    if (cardRef) {
      cardRef.snapTo({ index: 0 });
    }
  }

  function handleDiscard(direction: DiscardDirection) {
    FastVibrate();
    if (props.onSwipe) {
      props.onSwipe(direction);
    }
  }
  // Runtime stylization
  const runtimeStyle = {
    height: viewType === 'card' ? containerHeight : '100%',
    marginBottom: viewType === 'card' ? TabHeight : undefined,
  };
  return (
    <Interactable.View
      style={{
        ...runtimeStyle,
        ...styles.interactableContainer,
      }}
      ref={ref => (cardRef = ref)}
      animatedNativeDriver={true}
      snapPoints={snapPoints}
      animatedValueX={deltaX}
      animatedValueY={deltaY}
      horizontalOnly={viewType === 'page'}
      dragEnabled={viewType === 'card'}
      gravityPoints={[
        {
          x: 0,
          y: 0,
          strength: 2000,
          falloff: 40,
          damping: 1,
        },
      ]}
      onSnap={(event: Interactable.ISnapEvent) => {
        const snapDirection = event.nativeEvent.id as DiscardDirection;
        if (snapDirection !== 'center') {
          handleDiscard(snapDirection);
        }
      }}>
      {viewType === 'card' && renderLikeInfoIcon()}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ rotate: rotation }, { scale }],
          },
        ]}>
        <ProfileCardContent
          {...(props as ProfileCardContentProps)}
          key="card-content"
          onPress={() => {
            FastVibrate();
            setViewType(viewType === 'page' ? 'card' : 'page');
          }}
          onLike={handleLike}
          onDislike={handleDislike}
          showButtons={viewType === 'card'}
          showDescription={viewType === 'page'}
          showHobies={viewType === 'page'}
        />
      </Animated.View>
      {viewType === 'card' && renderDislikeInfoIcon()}
      {viewType === 'page' && renderCloseIcon()}
    </Interactable.View>
  );

  function renderCloseIcon() {
    return (
      <Icon
        name="times"
        style={styles.closeIcon}
        onPress={() => {
          FastVibrate();
          setViewType('card');
        }}
      />
    );
  }

  function renderDislikeInfoIcon() {
    return (
      <Animated.View
        style={{
          ...styles.dislikeHelperIcon,
          transform: [{ scale: iconScale }],
        }}>
        <FontAwesome5Icon
          style={styles.icon}
          size={100}
          name="times"
          color="black"
        />
      </Animated.View>
    );
  }

  function renderLikeInfoIcon() {
    return (
      <Animated.View
        style={{
          ...styles.likeHelperIcon,
          transform: [{ scale: iconScale }],
        }}>
        <FontAwesome5Icon
          size={100}
          style={styles.icon}
          name="heart"
          color="#f50a4d"
          solid
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  interactableContainer: {
    width: '100%',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    flexDirection: 'row',
  },
  likeHelperIcon: {
    marginLeft: -86,
    marginRight: 0,
  },
  dislikeHelperIcon: {
    marginRight: -86,
    marginLeft: 0,
  },
  icon: { width: 100, height: 100 },
  container: {
    flex: 1,
    width: '90%',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 10,
    ...defaultShadow,
  },
  closeIcon: {
    position: 'absolute',
    left: 10,
    top: 0,
  },
});
