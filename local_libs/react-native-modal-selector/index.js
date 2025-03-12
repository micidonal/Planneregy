'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native';

import styles from './style';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

let componentIndex = 0;

const propTypes = {
    data:                           PropTypes.array,
    onChange:                       PropTypes.func,
    initValue:                      PropTypes.string,
    animationType:                  PropTypes.oneOf(['none', 'slide', 'fade']),
    style:                          PropTypes.object,
    selectStyle:                    PropTypes.object,
    selectTextStyle:                PropTypes.object,
    optionStyle:                    PropTypes.object,
    optionTextStyle:                PropTypes.object,
    optionContainerStyle:           PropTypes.object,
    sectionStyle:                   PropTypes.object,
    sectionTextStyle:               PropTypes.object,
    cancelContainerStyle:           PropTypes.object,
    cancelStyle:                    PropTypes.object,
    cancelTextStyle:                PropTypes.object,
    overlayStyle:                   PropTypes.object,
    cancelText:                     PropTypes.string,
    disabled:                       PropTypes.bool,
    supportedOrientations:          PropTypes.arrayOf(PropTypes.oneOf(['portrait', 'landscape'])),
    keyboardShouldPersistTaps:      PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    backdropPressToClose:           PropTypes.bool,
    accessible:                     PropTypes.bool,
    scrollViewAccessibilityLabel:   PropTypes.string,
    cancelButtonAccessibilityLabel: PropTypes.string,
};

const defaultProps = {
    data:                           [],
    onChange:                       () => {},
    initValue:                      'Select me!',
    animationType:                  'slide',
    style:                          {},
    selectStyle:                    {},
    selectTextStyle:                {},
    optionStyle:                    {},
    optionTextStyle:                {},
    optionContainerStyle:           {},
    sectionStyle:                   {},
    sectionTextStyle:               {},
    cancelContainerStyle:           {},
    cancelStyle:                    {},
    cancelTextStyle:                {},
    overlayStyle:                   {},
    cancelText:                     'cancel',
    disabled:                       false,
    supportedOrientations:          ['portrait', 'landscape'],
    keyboardShouldPersistTaps:      'always',
    backdropPressToClose:           false,
    accessible:                     false,
    scrollViewAccessibilityLabel:   undefined,
    cancelButtonAccessibilityLabel: undefined,
};

console.log("Using LOCAL react-native-modal-selector!");

export default class ModalSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible:  true,
            selected:      props.initValue,
            cancelText:    props.cancelText,
            changedItem:   undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue !== this.props.initValue) {
            this.setState({selected: nextProps.initValue});
        }
    }

    onChange = (item) => {
        this.props.onChange(item);
        this.setState({selected: item.label, changedItem: item });
        this.props.onClose();
    }

    close = () => {
        this.setState({
            modalVisible: false,
        });
    }

    open = () => {
        this.setState({
            modalVisible: true,
            changedItem:  undefined,
        });
    }

    renderSection = (section) => {
        return (
            <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption = (option, isLastItem) => {
      if (!option.style) {
        option.style = {};
      }
        return (
            <TouchableOpacity key={option.key} onPress={() => this.onChange(option)} accessible={this.props.accessible} accessibilityLabel={option.accessibilityLabel || undefined}>
                <View style={[styles.optionStyle, this.props.optionStyle, isLastItem &&
                {borderBottomWidth: 0}]}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, option.style]}>{option.label}</Text>
                </View>
            </TouchableOpacity>);
    }

    renderOptionList = () => {

        let options = this.props.data.map((item, index) => {
            if (item.section) {
                return this.renderSection(item);
            }
            return this.renderOption(item, index === this.props.data.length - 1);
        });

        const closeOverlay = this.props.backdropPressToClose;

        return (
            <TouchableWithoutFeedback 
                onPress={() => {
                    closeOverlay && this.onClose();
            }}>
                <View style={[styles.overlayStyle, this.props.overlayStyle]}>
                    <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
                        <ScrollView keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} accessible={this.props.accessible} accessibilityLabel={this.props.scrollViewAccessibilityLabel}>
                            <View style={{paddingHorizontal: 10}}>
                                {options}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={[styles.cancelContainer, this.props.cancelContainerStyle]}>
                        <TouchableOpacity onPress={this.props.onClose} accessible={this.props.accessible} accessibilityLabel={this.props.cancelButtonAccessibilityLabel}>
                            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                                <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }

    renderChildren = () => {

        if(this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
            </View>
        );
    }

    render() {

        const dp = (
            <Modal
                transparent={true}
                ref={element => this.model = element}
                supportedOrientations={this.props.supportedOrientations}
                visible={true}
                onRequestClose={this.props.onClose}
                animationType={this.props.animationType}
            >
                {this.renderOptionList()}
            </Modal>
        );

        return (
            <View style={this.props.style}>
                {dp}
            </View>
        );
    }
}

ModalSelector.propTypes = propTypes;
ModalSelector.defaultProps = defaultProps;
