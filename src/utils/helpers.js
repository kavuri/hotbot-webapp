/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';
import { isEqual } from 'lodash';

export const timeDiff = (from, to) => {
    let diff = new Date(to).getTime() - new Date(from).getTime();
    let msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    let timeStr = ((isEqual(hh, 0) ? '' : + ' ' + hh + ' hrs') + (isEqual(mm, 0) ? '' : ' ' + mm + ' mins'));
    return timeStr;
}