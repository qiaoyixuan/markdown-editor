import _ from 'lodash';

export const getRelativePosition = obj => {
    var parObj = obj,
        left = obj.offsetLeft,
        top  = obj.offsetTop;
    while(parObj = parObj.offsetParent) {
        left += parObj.offsetLeft;
        top  += parObj.offsetTop;
    }
    return [left, top];
};

export const expendObject = (obj, expendObj) => {
    return _.merge(_.cloneDeep(obj, true), expendObj);
};
