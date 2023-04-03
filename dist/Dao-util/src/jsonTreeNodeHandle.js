"use strict";
/**
 * json树动态处理
 */
class JsonTreeNodeHandle {
    constructor(nodeKey, nodeChildren = "children") {
        this.nodeKey = "";
        this.nodeChildren = "children";
        this.data = {};
        this.nodeKey = nodeKey;
        this.nodeChildren = nodeChildren;
    }
    /**
     * 所需要修改的数据
     * @param {*} data
     * @returns
     */
    json(data) {
        this.data = data;
        return this;
    }
    /**
     * 添加
     * @param nodeValue
     * @param nodeObj
     * @returns
     */
    add(nodeValue, nodeObj) {
        let data = this.data;
        this.data = this._handleAdd(data, nodeValue, nodeObj);
        return this;
    }
    /**
     * 添加数据处理逻辑
     * @param {*} data
     * @param {*} nodeValue
     * @param {*} nodeObj
     * @returns
     */
    _handleAdd(data, nodeValue, nodeObj) {
        if (data.hasOwnProperty("length")) {
            // 说明是个数组 需要循环
            data.forEach((element, index) => {
                if (element[this.nodeKey] === nodeValue) {
                    if (!element.hasOwnProperty(this.nodeChildren)) {
                        element[this.nodeChildren] = [nodeObj];
                    }
                    else {
                        if (typeof nodeObj === "string") {
                            let o = {};
                            o[this.nodeKey] = nodeObj;
                            element[this.nodeChildren].push(o);
                        }
                        else {
                            element[this.nodeChildren].push(nodeObj);
                        }
                    }
                }
                else if (element.hasOwnProperty(this.nodeChildren)) {
                    this._handleAdd(element, nodeValue, nodeObj);
                }
            });
        }
        else {
            // 说明不是个数组 直接对象
            if (data.hasOwnProperty(this.nodeKey) && data[this.nodeKey] === nodeValue) {
                // KEY相等且值一样
                if (data.hasOwnProperty(this.nodeChildren)) {
                    if (typeof nodeObj === "string") {
                        let e = {};
                        e[this.nodeKey] = nodeObj;
                        data[this.nodeChildren].push(e);
                    }
                    else {
                        data[this.nodeChildren].push(nodeObj);
                    }
                }
            }
            if (data.hasOwnProperty(this.nodeChildren)) {
                this._handleAdd(data[this.nodeChildren], nodeValue, nodeObj);
            }
        }
        return data;
    }
    render() {
        return this.data;
    }
    /**
     * 移除某个Key
     * @param {*} nodeValue
     */
    remove(nodeValue) {
        let data = this.data;
        this.data = this._handleRemove(data, nodeValue);
        return this;
    }
    /**
     * 移除数据处理逻辑
     * @param {*} data
     * @param {*} nodeValue
     * @returns
     */
    _handleRemove(data, nodeValue) {
        /**
         * 1. 判断是否是个数组
         * 2. 数组则遍历循环，
         * 3. 删除符合条件的对象
         */
        if (data.hasOwnProperty("length")) {
            data.forEach((element, index) => {
                if (element[this.nodeKey] === nodeValue) {
                    data.splice(index, 1);
                }
                else {
                    if (element.hasOwnProperty(this.nodeChildren)) {
                        this._handleRemove(element[this.nodeChildren], nodeValue);
                    }
                }
            });
        }
        else {
            // 直接就是对象，直接操作
            if (data[this.nodeKey] === nodeValue) {
                // 直接根路径  由于是节点的根路径，则直接删除了
                data = {};
                data[this.nodeKey] = "undefined";
            }
            else {
                if (data.hasOwnProperty(this.nodeChildren)) {
                    this._handleRemove(data[this.nodeChildren], nodeValue);
                }
            }
        }
        return data;
    }
    /**
     * 对某个KEY进行更改
     * @param {*} nodeValue
     * @param {*} nodeObj
     */
    update(nodeValue, nodeObj) {
        let data = this.data;
        this.data = this._handleUpdate(data, nodeValue, nodeObj);
        return this;
    }
    _handleUpdate(data, nodeValue, nodeObj) {
        /**
         * 1. 判断类型
         * 2.
         */
        if (data.hasOwnProperty("length")) {
            data.forEach((element, index) => {
                if (element[this.nodeKey] === nodeValue) {
                    if (typeof nodeObj === "object") {
                        data[index] = nodeObj;
                    }
                    else {
                        element[this.nodeKey] = nodeObj;
                    }
                }
                else {
                    if (element.hasOwnProperty(this.nodeChildren)) {
                        this._handleUpdate(element[this.nodeChildren], nodeValue, nodeObj);
                    }
                }
            });
        }
        else {
            // 直接就是对象，直接操作
            if (data[this.nodeKey] === nodeValue) {
                // 直接根路径  由于是节点的根路径，则直接删除了
                data = {};
                data[this.nodeKey] = nodeObj;
            }
            else {
                if (data.hasOwnProperty(this.nodeChildren)) {
                    this._handleUpdate(data[this.nodeChildren], nodeValue, nodeObj);
                }
            }
        }
        return data;
    }
}
