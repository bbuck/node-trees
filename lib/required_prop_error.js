function RequiredPropertyError(msg) {
  this.message = msg || "You are missing a required property.";
}

RequiredPropertyError.prototype = new Error;

module.exports = RequiredPropertyError;