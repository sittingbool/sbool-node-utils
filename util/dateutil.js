/**
 * Created by richardhabermann on 08.08.14.
 */

var dateformat = require('dateformat');
var stringUtil = require('./string');

var inputFormat, outputFormat;
inputFormat = outputFormat = 'ddd, dd mmm yyyy HH:MM:ss Z';//dateformat.masks.expiresHeaderFormat; // 'ddd, dd mmm yyyy HH:MM:ss Z';

exports.nowToString = function( output ) {
    if (output !== undefined && output) {
        return this.outputDate(new Date());
    }
    return this.inputDate(new Date());
};
exports.outputDate = function ( date ) {
    return dateformat(date, outputFormat).replace(/GMT/, '');
};
exports.inputDate = function ( date ) {
    return dateformat(date, inputFormat).replace(/GMT/, '');
};
exports.dateFromInputString = function ( input) {
    var defaultFormattedDateString = dateformat(input,
      'mmmm d, yyyy HH:MM:ss');

    return new Date( defaultFormattedDateString);
};

/**
 *
 * @param date - original date
 * @param otherDate - date tp compare with
 * @returns {number} 0 when equal, negative number (milliseconds) when date is before otherDate,
 *          positive number (milliseconds) when date is after otherDate
 */
function compareDateWithDate(date, otherDate) {
    if ( date instanceof Date === false || otherDate instanceof Date === false ) {
        return 0;
    }
    return date.getTime() - otherDate.getTime();
}

exports.compareDateWithDate = compareDateWithDate;

exports.dateIsBeforeDate = function(date, otherDate) {
    return compareDateWithDate( date, otherDate) < 0;
};

exports.dateIsAfterDate = function(date, otherDate) {
    return compareDateWithDate( date, otherDate) > 0;
};

exports.dateIsEqualToDate = function(date, otherDate) {
    return compareDateWithDate( date, otherDate) === 0;
};



//------------------------------------------------------------------------------------------------------
exports.setDatesForContainer = function( container)
//------------------------------------------------------------------------------------------------------
{
    switch ( container.saveMode ) {

        case 'create':
            this.setDatesForCreateContainer(container);
            break;

        case 'update':
            this.setDatesForUpdateContainer(container);
            break;

        default:
            break;
    }
};


//------------------------------------------------------------------------------------------------------
exports.setDatesForCreateContainer = function( container)
//------------------------------------------------------------------------------------------------------
{
    var /*type = container.getType(),*/
        presentationStartDate, /*presentationEndDate = null,*/
        labelStartDate, /*labelEndDate = null,*/ createdDate
        ;

    createdDate = container.getData('created');

    if ( createdDate === null ) {
        createdDate = new Date();
    }

    labelStartDate = container.getLabelStartDate();
    //labelEndDate = container.getLabelEndDate();

    presentationStartDate = container.getPresentationStartDate();
    //presentationEndDate = container.getPresentationEndDate();

    if ( labelStartDate === null ) {
        labelStartDate = createdDate;
    }

    if ( presentationStartDate === null ) {
        presentationStartDate = labelStartDate;
    }

    container.setLabelStartDate( labelStartDate);
    container.setPresentationStartDate(presentationStartDate);
};


//------------------------------------------------------------------------------------------------------
exports.setDatesForUpdateContainer = function( container)
//------------------------------------------------------------------------------------------------------
{
    var type = container.getType(),
        presentationStartDate, /*presentationEndDate = null,*/
        labelStartDate, /*labelEndDate = null,*/ createdDate
        ;

    if ( type !== null ) {
        type = type.getName();
    }

    createdDate = container.getData('created');

    labelStartDate = container.getLabelStartDate();
    //labelEndDate = container.getLabelEndDate();

    presentationStartDate = container.getPresentationStartDate();
    //presentationEndDate = container.getPresentationEndDate();


    switch ( type ) {
        case 'radioshow':
        {
            if ( labelStartDate === null ) {
                labelStartDate = createdDate;
            }
            if ( this.compareDateWithDate(labelStartDate, presentationStartDate) !== 0 ||
                presentationStartDate === null )
            {
                presentationStartDate = labelStartDate;
            }
            break;
        }

        default:
        {
            if ( presentationStartDate === null ) {
                presentationStartDate = createdDate;
            }
            if ( this.compareDateWithDate(labelStartDate, presentationStartDate) !== 0 ||
                labelStartDate === null )
            {
                labelStartDate = presentationStartDate;
            }
            break;
        }
    }

    container.setLabelStartDate( labelStartDate);
    container.setPresentationStartDate(presentationStartDate);
};


//------------------------------------------------------------------------------------------------------
exports.dateFromTimeStringOfToday = function( timeString)
//------------------------------------------------------------------------------------------------------
{
    timeString = timeString.trim();
    return new Date(dateformat( new Date(), 'fullDate')+' '+timeString);
};
