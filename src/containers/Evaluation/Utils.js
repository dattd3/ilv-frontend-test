import Constants from 'commons/Constants'
import { formulaConfig } from './Constants'

const formatIndexText = index => {
    const mapping = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X',
    }
    return mapping[index]
}

const calculateRating = (score = 0) => {
    if (score > 100) {
        return ''
    } else if (score >= 95 && score <= 100) {
        return 'A'
    } else if (score >= 85 && score < 95) {
        return 'B'
    } else if (score >= 75 && score < 85) {
        return 'C'
    }
    return 'D'
}

const formatTargetText = str => str?.replace(/\n|\r/g, "")

const isVinBusByCompanyCode = code => code === Constants.pnlVCode.VinBus

const calculateScore = (formulaCode, targetValue, weight, actualScore) => {
    try {
        let score = 0
        switch (formulaCode) {
            case formulaConfig.CT1:
                score = (actualScore/targetValue) * (weight/100)
                break;
            case formulaConfig.CT2:
                score = (targetValue/actualScore) * (weight/100)
                break;
            case formulaConfig.CT3:
                if (actualScore >= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = 0
                }
                break;
            case formulaConfig.CT4:
                if (actualScore <= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = 0
                }
                break;
            case formulaConfig.CT5:
                if (actualScore >= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = (actualScore/targetValue) * (weight/100)
                }
                break;
            case formulaConfig.CT6:
                if (actualScore <= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = (actualScore/targetValue) * (weight/100)
                }
                break;
            case formulaConfig.CT7:
                if (actualScore >= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = (targetValue/actualScore) * (weight/100)
                }
                break;
            case formulaConfig.CT8:
                if (actualScore <= targetValue) {
                    score = 100 * (weight/100)
                } else {
                    score = (targetValue/actualScore) * (weight/100)
                }
                break;

        }
        return score || 0
    } catch (error) {
        console.log(error)
        return 0
    }
}

export { formatIndexText, calculateRating, formatTargetText, calculateScore, isVinBusByCompanyCode }
