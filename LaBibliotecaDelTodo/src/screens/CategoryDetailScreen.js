import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryDetailScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>Category Detail Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryDetailScreen;