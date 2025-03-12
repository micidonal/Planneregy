declare module 'react-native-modal-selector' {
    import React from 'react';
    import { StyleProp, ViewStyle, TextStyle } from 'react-native';
  
    export interface ModalSelectorProps {
      data: Array<{ key: string | number; label: string }>;
      initValue?: string;
      onChange?: (item: { key: string | number; label: string }) => void;
      animationType?: 'none' | 'slide' | 'fade';
      style?: StyleProp<ViewStyle>;
      selectStyle?: StyleProp<ViewStyle>;
      selectTextStyle?: StyleProp<TextStyle>;
      optionStyle?: StyleProp<ViewStyle>;
      optionTextStyle?: StyleProp<TextStyle>;
      optionContainerStyle?: StyleProp<ViewStyle>;
      sectionStyle?: StyleProp<ViewStyle>;
      sectionTextStyle?: StyleProp<TextStyle>;
      cancelContainerStyle?: StyleProp<ViewStyle>;
      cancelStyle?: StyleProp<ViewStyle>;
      cancelTextStyle?: StyleProp<TextStyle>;
      overlayStyle?: StyleProp<ViewStyle>;
      cancelText?: string;
      disabled?: boolean;
      supportedOrientations?: Array<'portrait' | 'landscape'>;
      keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
      backdropPressToClose?: boolean;
      accessible?: boolean;
      scrollViewAccessibilityLabel?: string;
      cancelButtonAccessibilityLabel?: string;
    }
  
    const ModalSelector: React.FC<ModalSelectorProps>;
    export default ModalSelector;
  }