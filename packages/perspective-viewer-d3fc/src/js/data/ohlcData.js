/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */
import {labelFunction} from "../axis/crossAxis";
import {splitIntoMultiSeries} from "./splitIntoMultiSeries";

const flattenArray = array => {
    if (Array.isArray(array)) {
        return [].concat(...array.map(flattenArray));
    } else {
        return [array];
    }
};

export function ohlcData(settings, data) {
    return flattenArray(splitIntoMultiSeries(settings, data, {excludeEmpty: true}).map(data => seriesToOHLC(settings, data)));
}

function seriesToOHLC(settings, data) {
    const labelfn = labelFunction(settings);

    const mappedSeries = data.map((col, i) => {
        const openValue = settings.mainValues.length >= 2 ? col[settings.mainValues[0].name] : undefined;
        const closeValue = settings.mainValues.length >= 2 ? col[settings.mainValues[1].name] : undefined;
        return {
            crossValue: labelfn(col, i),
            mainValues: settings.mainValues.map(v => col[v.name]),
            openValue: openValue,
            closeValue: closeValue,
            highValue: settings.mainValues.length >= 3 ? col[settings.mainValues[2].name] : Math.max(openValue, closeValue),
            lowValue: settings.mainValues.length >= 4 ? col[settings.mainValues[3].name] : Math.min(openValue, closeValue),
            key: data.key
        };
    });

    mappedSeries.key = data.key;
    return mappedSeries;
}
