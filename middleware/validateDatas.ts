import { body } from 'express-validator'

export const checkValidateDatas = (property: string, min: number, max: number) => {
	return body(property).trim().isLength({ min: min, max: max }).withMessage('Error, incorrect data')
}