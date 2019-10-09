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
	 * Absolute path {@link https://hapi.dev/family/joi/ Joi schema}.
	 *
	 * @type {Joi.StringSchema}
	 */
	get absolutePath() {
		return Joi.string().pattern(/^\//u, 'absolute path');
	}


	/**
	 * Variable name {@link https://hapi.dev/family/joi/ Joi schema}.
	 *
	 * @type {Joi.StringSchema}
	 */
	get variableName() {
		return Joi.string().pattern(/^[a-z]\w+$/ui, 'variable name');
	}


	/**
	 * Validate method argument.
	 *
	 * @param {string} label - Name of the argument.
	 * @param {*} value - Value of the argument.
	 * @param {Joi.Schema} schema - {@link https://hapi.dev/family/joi/ Joi schema}.
	 */
	argument(label, value, schema) {
		const { error } = Joi.object({ [label]: schema }).validate({ [label]: value });

		if (error) {
			throw new ValidationError(error.annotate(), error.details, error._original);
		}
	}

}


export default new DataValidationHelper();
