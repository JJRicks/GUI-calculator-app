import React from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  function handlePress() {
    // what we do when a key is pressed
  }
  // use Android ripple effect for fun 
  const rippleConfig = { color: "#ffffff22" }; // color prop object 
  
  // Pressable button will call this and pass in a state obejct
  // and return a ViewStyle styleprop
  function getPressableStyle(state: PressableStateCallbackType): StyleProp<ViewStyle>{
    // start with the base style
    // this is a view style array, otherwise typescript gets confused 
    const stylesToApply: StyleProp<ViewStyle>[] = [styles.key];
    // if the button is pushed, add the pressed style to the array, which will override
    // the base
    if (state.pressed === true) {
      stylesToApply.push(styles.keyPressed);
    }
    return stylesToApply;
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        android_ripple={rippleConfig}
        style={getPressableStyle}
      >
        <Text style={styles.keyText}>7</Text>
      </Pressable>
    </View>

  );
}
// create a stylesheet called styles, to reference what things will look like
const styles = StyleSheet.create<{
  container: ViewStyle;
  key: ViewStyle;
  keyPressed: ViewStyle;
  keyText: TextStyle;
}>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b0b",
  },
  key: { // our default key color
    backgroundColor: "#3c3b3bff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  keyPressed: { // when the key is pressed drop the opacity to give it a color change
    opacity: 0.4,
  },
  keyText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
});