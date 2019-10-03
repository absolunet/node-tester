//--------------------------------------------------------
//-- Data validation
//--------------------------------------------------------
import Joi, { ValidationError } from '@hapi/joi';


/**
 * Data validation helper.
 *
 * @hideconstructor
 */
class DataValidationHelper {

	/**
	 * Validate method argument.
	 *
	 * @param {string} label - Name of the argument.
	 * @param {*} value - Value of the argument.
	 * @param {JoiSchema} schema - {@link https://hapi.dev/family/joi/ Joi validation schema}.
	 */
	argument(label, value, schema) {
		const { error } = Joi.object({ [label]: schema }).validate({ [label]: value });

		if (error) {
			throw new ValidationError(error.annotate(), error.details, error._original);
		}
	}

}


export default new DataValidationHelper();
