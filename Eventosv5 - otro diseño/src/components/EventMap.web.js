import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const EventMap = ({ style }) => {
  return (
    <View style={style}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.border,
        }}
      >
        <Text
          style={{
            ...FONTS.caption,
            color: COLORS.textSecondary,
          }}
        >
          Vista de mapa no disponible en la versión web
        </Text>
      </View>
    </View>
  );
};

export default EventMap;

