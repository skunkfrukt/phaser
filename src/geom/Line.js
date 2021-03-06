/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Line object with a start and an end point.
* 
* @class Phaser.Line
* @constructor
* @param {number} [x1=0] - The x coordinate of the start of the line.
* @param {number} [y1=0] - The y coordinate of the start of the line.
* @param {number} [x2=0] - The x coordinate of the end of the line.
* @param {number} [y2=0] - The y coordinate of the end of the line.
*/
Phaser.Line = function (x1, y1, x2, y2) {

    x1 = x1 || 0;
    y1 = y1 || 0;
    x2 = x2 || 0;
    y2 = y2 || 0;

    /**
    * @property {Phaser.Point} start - The start point of the line.
    */
    this.start = new Phaser.Point(x1, y1);

    /**
    * @property {Phaser.Point} end - The end point of the line.
    */
    this.end = new Phaser.Point(x2, y2);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.LINE;

};

Phaser.Line.prototype = {

    /**
    * Sets the components of the Line to the specified values.
    * 
    * @method Phaser.Line#setTo
    * @param {number} [x1=0] - The x coordinate of the start of the line.
    * @param {number} [y1=0] - The y coordinate of the start of the line.
    * @param {number} [x2=0] - The x coordinate of the end of the line.
    * @param {number} [y2=0] - The y coordinate of the end of the line.
    * @return {Phaser.Line} This line object
    */
    setTo: function (x1, y1, x2, y2) {

        this.start.setTo(x1, y1);
        this.end.setTo(x2, y2);

        return this;

    },

    /**
    * Sets the line to match the x/y coordinates of the two given sprites.
    * Can optionally be calculated from their center coordinates.
    * 
    * @method Phaser.Line#fromSprite
    * @param {Phaser.Sprite} startSprite - The coordinates of this Sprite will be set to the Line.start point.
    * @param {Phaser.Sprite} endSprite - The coordinates of this Sprite will be set to the Line.start point.
    * @param {boolean} [useCenter=false] - If true it will use startSprite.center.x, if false startSprite.x. Note that Sprites don't have a center property by default, so only enable if you've over-ridden your Sprite with a custom class.
    * @return {Phaser.Line} This line object
    */
    fromSprite: function (startSprite, endSprite, useCenter) {

        if (typeof useCenter === 'undefined') { useCenter = false; }

        if (useCenter)
        {
            return this.setTo(startSprite.center.x, startSprite.center.y, endSprite.center.x, endSprite.center.y);
        }

        return this.setTo(startSprite.x, startSprite.y, endSprite.x, endSprite.y);

    },

    /**
    * Sets this line to start at the given `x` and `y` coordinates and for the segment to extend at `angle` for the given `length`.
    * 
    * @method Phaser.Line#fromAngle
    * @param {number} x - The x coordinate of the start of the line.
    * @param {number} y - The y coordinate of the start of the line.
    * @param {number} angle - The angle of the line in radians.
    * @param {number} length - The length of the line in pixels.
    * @return {Phaser.Line} This line object
    */
    fromAngle: function (x, y, angle, length) {

        this.start.setTo(x, y);
        this.end.setTo(x + (Math.cos(angle) * length), y + (Math.sin(angle) * length));

        return this;

    },

    /**
    * Checks for intersection between this line and another Line.
    * If asSegment is true it will check for segment intersection. If asSegment is false it will check for line intersection.
    * Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
    *
    * @method Phaser.Line#intersects
    * @param {Phaser.Line} line - The line to check against this one.
    * @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
    * @param {Phaser.Point} [result] - A Point object to store the result in, if not given a new one will be created.
    * @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
    */
    intersects: function (line, asSegment, result) {

        return Phaser.Line.intersectsPoints(this.start, this.end, line.start, line.end, asSegment, result);

    },

    /**
    * Returns the reflected angle between two lines.
    * This is the outgoing angle based on the angle of this line and the normalAngle of the given line.
    *
    * @method Phaser.Line#reflect
    * @param {Phaser.Line} line - The line to reflect off this line.
    * @return {number} The reflected angle in radians.
    */
    reflect: function (line) {

        return Phaser.Line.reflect(this, line);

    },

    /**
    * Tests if the given coordinates fall on this line. See pointOnSegment to test against just the line segment.
    * 
    * @method Phaser.Line#pointOnLine
    * @param {number} x - The line to check against this one.
    * @param {number} y - The line to check against this one.
    * @return {boolean} True if the point is on the line, false if not.
    */
    pointOnLine: function (x, y) {

        return ((x - this.start.x) * (this.end.y - this.start.y) === (this.end.x - this.start.x) * (y - this.start.y));

    },

    /**
    * Tests if the given coordinates fall on this line and within the segment. See pointOnLine to test against just the line.
    * 
    * @method Phaser.Line#pointOnSegment
    * @param {number} x - The line to check against this one.
    * @param {number} y - The line to check against this one.
    * @return {boolean} True if the point is on the line and segment, false if not.
    */
    pointOnSegment: function (x, y) {

        var xMin = Math.min(this.start.x, this.end.x);
        var xMax = Math.max(this.start.x, this.end.x);
        var yMin = Math.min(this.start.y, this.end.y);
        var yMax = Math.max(this.start.y, this.end.y);

        return (this.pointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax));

    },

    /**
    * Using Bresenham's line algorithm this will return an array of all coordinates on this line.
    * The start and end points are rounded before this runs as the algorithm works on integers.
    *
    * @method Phaser.Line#coordinatesOnLine
    * @param {number} [stepRate=1] - How many steps will we return? 1 = every coordinate on the line, 2 = every other coordinate, etc.
    * @param {array} [results] - The array to store the results in. If not provided a new one will be generated.
    * @return {array} An array of coordinates.
    */
    coordinatesOnLine: function (stepRate, results) {

        if (typeof stepRate === 'undefined') { stepRate = 1; }
        if (typeof results === 'undefined') { results = []; }

        var x1 = Math.round(this.start.x);
        var y1 = Math.round(this.start.y);
        var x2 = Math.round(this.end.x);
        var y2 = Math.round(this.end.y);

        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;

        results.push([x1, y1]);

        var i = 1;

        while (!((x1 == x2) && (y1 == y2)))
        {
            var e2 = err << 1;

            if (e2 > -dy)
            {
                err -= dy;
                x1 += sx;
            }

            if (e2 < dx)
            {
                err += dx;
                y1 += sy;
            }

            if (i % stepRate === 0)
            {
                results.push([x1, y1]);
            }

            i++;

        }

        return results;

    },

    /**
     * Returns a new Line object with the same values for the start and end properties as this Line object.
     * @method Phaser.Line#clone
     * @param {Phaser.Line} output - Optional Line object. If given the values will be set into the object, otherwise a brand new Line object will be created and returned.
     * @return {Phaser.Line} The cloned Line object.
     */
    clone: function (output) {

        if (typeof output === "undefined" || output === null)
        {
            output = new Phaser.Line(this.start.x, this.start.y, this.end.x, this.end.y);
        }
        else
        {
            output.setTo(this.start.x, this.start.y, this.end.x, this.end.y);
        }

        return output;

    }

};

/**
* @name Phaser.Line#length
* @property {number} length - Gets the length of the line segment.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "length", {

    get: function () {
        return Math.sqrt((this.end.x - this.start.x) * (this.end.x - this.start.x) + (this.end.y - this.start.y) * (this.end.y - this.start.y));
    }

});

/**
* @name Phaser.Line#angle
* @property {number} angle - Gets the angle of the line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "angle", {

    get: function () {
        return Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
    }

});

/**
* @name Phaser.Line#slope
* @property {number} slope - Gets the slope of the line (y/x).
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "slope", {

    get: function () {
        return (this.end.y - this.start.y) / (this.end.x - this.start.x);
    }

});

/**
* @name Phaser.Line#perpSlope
* @property {number} perpSlope - Gets the perpendicular slope of the line (x/y).
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "perpSlope", {

    get: function () {
        return -((this.end.x - this.start.x) / (this.end.y - this.start.y));
    }

});

/**
* @name Phaser.Line#x
* @property {number} x - Gets the x coordinate of the top left of the bounds around this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "x", {

    get: function () {
        return Math.min(this.start.x, this.end.x);
    }

});

/**
* @name Phaser.Line#y
* @property {number} y - Gets the y coordinate of the top left of the bounds around this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "y", {

    get: function () {
        return Math.min(this.start.y, this.end.y);
    }

});

/**
* @name Phaser.Line#left
* @property {number} left - Gets the left-most point of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "left", {

    get: function () {
        return Math.min(this.start.x, this.end.x);
    }

});

/**
* @name Phaser.Line#right
* @property {number} right - Gets the right-most point of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "right", {

    get: function () {
        return Math.max(this.start.x, this.end.x);
    }

});

/**
* @name Phaser.Line#top
* @property {number} top - Gets the top-most point of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "top", {

    get: function () {
        return Math.min(this.start.y, this.end.y);
    }

});

/**
* @name Phaser.Line#bottom
* @property {number} bottom - Gets the bottom-most point of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "bottom", {

    get: function () {
        return Math.max(this.start.y, this.end.y);
    }

});

/**
* @name Phaser.Line#width
* @property {number} width - Gets the width of this bounds of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "width", {

    get: function () {
        return Math.abs(this.start.x - this.end.x);
    }

});

/**
* @name Phaser.Line#height
* @property {number} height - Gets the height of this bounds of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "height", {

    get: function () {
        return Math.abs(this.start.y - this.end.y);
    }

});

/**
* @name Phaser.Line#normalX
* @property {number} normalX - Gets the x component of the left-hand normal of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "normalX", {

    get: function () {
        return Math.cos(this.angle - 1.5707963267948966);
    }

});

/**
* @name Phaser.Line#normalY
* @property {number} normalY - Gets the y component of the left-hand normal of this line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "normalY", {

    get: function () {
        return Math.sin(this.angle - 1.5707963267948966);
    }

});

/**
* @name Phaser.Line#normalAngle
* @property {number} normalAngle - Gets the angle in radians of the normal of this line (line.angle - 90 degrees.)
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "normalAngle", {

    get: function () {
        return Phaser.Math.wrap(this.angle - 1.5707963267948966, -Math.PI, Math.PI);
    }

});

/**
* Checks for intersection between two lines as defined by the given start and end points.
* If asSegment is true it will check for line segment intersection. If asSegment is false it will check for line intersection.
* Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
* Adapted from code by Keith Hair
*
* @method Phaser.Line.intersectsPoints
* @param {Phaser.Point} a - The start of the first Line to be checked.
* @param {Phaser.Point} b - The end of the first line to be checked.
* @param {Phaser.Point} e - The start of the second Line to be checked.
* @param {Phaser.Point} f - The end of the second line to be checked.
* @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
* @param {Phaser.Point|object} [result] - A Point object to store the result in, if not given a new one will be created.
* @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
*/
Phaser.Line.intersectsPoints = function (a, b, e, f, asSegment, result) {

    if (typeof asSegment === 'undefined') { asSegment = true; }
    if (typeof result === 'undefined') { result = new Phaser.Point(); }

    var a1 = b.y - a.y;
    var a2 = f.y - e.y;
    var b1 = a.x - b.x;
    var b2 = e.x - f.x;
    var c1 = (b.x * a.y) - (a.x * b.y);
    var c2 = (f.x * e.y) - (e.x * f.y);
    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0)
    {
        return null;
    }

    result.x = ((b1 * c2) - (b2 * c1)) / denom;
    result.y = ((a2 * c1) - (a1 * c2)) / denom;

    if (asSegment)
    {
        var uc = ((f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y));
        var ua = (((f.x - e.x) * (a.y - e.y)) - (f.y - e.y) * (a.x - e.x)) / uc;
        var ub = (((b.x - a.x) * (a.y - e.y)) - ((b.y - a.y) * (a.x - e.x))) / uc;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
        {
            return result;
        }
        else
        {
            return null;
        }
    }

    return result;

};

/**
* Checks for intersection between two lines.
* If asSegment is true it will check for segment intersection.
* If asSegment is false it will check for line intersection.
* Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
* Adapted from code by Keith Hair
*
* @method Phaser.Line.intersects
* @param {Phaser.Line} a - The first Line to be checked.
* @param {Phaser.Line} b - The second Line to be checked.
* @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
* @param {Phaser.Point} [result] - A Point object to store the result in, if not given a new one will be created.
* @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
*/
Phaser.Line.intersects = function (a, b, asSegment, result) {

    return Phaser.Line.intersectsPoints(a.start, a.end, b.start, b.end, asSegment, result);

};

/**
* Returns the reflected angle between two lines.
* This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
*
* @method Phaser.Line.reflect
* @param {Phaser.Line} a - The base line.
* @param {Phaser.Line} b - The line to be reflected from the base line.
* @return {number} The reflected angle in radians.
*/
Phaser.Line.reflect = function (a, b) {

    return 2 * b.normalAngle - 3.141592653589793 - a.angle;

};
