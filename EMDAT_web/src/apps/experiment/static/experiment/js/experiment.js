var idForm = '#settings-form';
var idWizard = '#wizard';
var idSelectTracker = '#id_eye_tracker';
var idSelectValidityMethod = '#id_validity_method';
var idFieldValidProportion = '#id_valid_proportion_threshold';
var idFieldValidTime = '#id_valid_time_threshold';
var idCheckboxAutoPartition = '#id_auto_partition_low_quality_segments';
var idFieldMinimumSegmentTime = '#id_minimum_segment_time';
var idDivSMI = '#smi';
var idDivTobii = "#tobii";
var idWarningMessage = '#file-list';

// DualListBox lists
var idGeneralList = '#general';
var idAOIList = '#aoi';
var idPupilList = '#pupil';
var idDistanceList = '#distance';
var idEventsList = '#events';

// Vars for functions
var loadPopover, loadDualListBox, loadCheckbox, loadSummaryFeatures;
var readySettings;
var changeTracker, changeValidityMethod, changeAutoPartition;
var createSummary,loadSummaryTracker, loadSummaryValidity, loadParticipants, loadWarningMessage;
var loadWizard;
var saveParameters;


allRules = {
    // Tobii
    extra_header_lines:{
        required: true,
        digits:true
    },
    fixation_header_lines:{
        required: true,
        digits:true
    },
    all_data_header_lines:{
        required: true,
        digits:true
    },
    events_header_lines:{
        required: true,
        digits:true
    },
    actions_header_lines:{
        required: true,
        digits:true
    },
    // SMI
    events_first_data_line:{
        required: true,
        digits:true
    },
    fixation_header_line:{
        required: true,
        digits:true
    },
    user_event_header_line:{
        required: true,
        digits:true
    },
    // Validity
    valid_proportion_threshold:{
        required: true,
        range: [0, 1]
    },
    valid_time_threshold:{
        required: true,
        digits:true
    },
    media_offset_x:{
        required:true,
        digits: true
    },
    media_offset_y:{
        required:true,
        digits:true
    },
    prune_length:{
        digits:true
    },
    minimum_segment_time:{
        required:true,
        digits:true
    },
    maximum_segment_time:{
        required:true,
        digits:true
    },
    // Participant
    min_id_participant:{
        required: true,
        digits:true
    },
    max_id_participant:{
        required: true,
        digits:true,
        greater_equal: ['min_id_participant', 'Max participant ID', 'Min participant ID']
    },
    missing_ids:{
        required: false,
        csv: true
    }
};

var validator = $(idForm).validate({
    rules: allRules,
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

// Custom rules
jQuery.validator.addMethod('greater_equal', function(value, element, params) {
    var min = $('#id_'+params[0]).val();
    return value >= parseInt(min)
}, jQuery.validator.format('{1} must be greater or equal to {2}'));

jQuery.validator.addMethod('csv', function(value, element, params) {
    return this.optional(element) || /^[0-9]+(,[0-9]+)*$/.test(value.replace(/ /g, ''));
}, jQuery.validator.format('Use the proper pattern. (e.g., 5,8,13)'));

// Functions
readySettings = function(){
    // Hide valid time threshold field
    $(idFieldValidTime).closest(".form-group").hide();

    loadCheckbox();
    loadPopover();
    loadDualListBox();
    changeTracker();
    changeValidityMethod();
    changeAutoPartition();
    loadWizard();
    saveParameters();
};

loadCheckbox = function(){
    $(':checkbox').checkboxpicker();
};

loadPopover = function(){
    $(function () {
        $('[data-toggle="popover"]').popover({
            container: 'body',
            html: true
        })
    });
};

loadDualListBox = function(){
    $(idGeneralList+', '+idAOIList+', '+idPupilList+', '+idDistanceList+', '+idEventsList).bootstrapDualListbox({
        nonSelectedListLabel: 'Non-selected:',
        selectedListLabel: 'Selected:',
        infoText:'{0}',
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false
    });
};

changeTracker = function(){
    $(idSelectTracker).change(function() {
        var val = this.value;
        if (val == 'Tobii' || val == 'TobiiV3'){
            $(idDivSMI).hide();
            $(idDivTobii).show();
        }
        else if (val == 'SMI'){
            $(idDivTobii).hide();
            $(idDivSMI).show();
        }
    });
};

changeValidityMethod = function(){
    $(idSelectValidityMethod).change(function(){
        var val = this.value;
        if (val == 1 || val == 3){
            $(idFieldValidProportion).closest(".form-group").show();
            $(idFieldValidTime).closest(".form-group").hide();
        }
        else if (val == 2){
            $(idFieldValidProportion).closest(".form-group").hide();
            $(idFieldValidTime).closest(".form-group").show();
        }
    });
};

changeAutoPartition = function(){
    $(idCheckboxAutoPartition).checkboxpicker().change(function(val) {
        if(this.checked) {
            $(idFieldMinimumSegmentTime).closest('.form-group').show();
        }
        else{
            $(idFieldMinimumSegmentTime).closest('.form-group').hide();
        }
    });
};

createSummary = function(){
    loadSummaryTracker();
    loadSummaryFeatures();
    loadSummaryValidity();
    loadParticipants();
};

loadSummaryFeatures = function(){
     // Clear content
    $('#tbody_general_features').empty();
    $('#tbody_aoi_features').empty();
    $('#tbody_pupil_features').empty();
    $('#tbody_distance_features').empty();
    $('#tbody_events_features').empty();

    // Append features
    $("#general > option:selected").each(function() {
        $('#tbody_general_features').append('<tr><td>' + this.text + '<td></tr>');
    });
    $("#aoi > option:selected").each(function() {
        $('#tbody_aoi_features').append('<tr><td>' + this.text + '<td></tr>');
    });
    $("#pupil > option:selected").each(function() {
        $('#tbody_pupil_features').append('<tr><td>' + this.text + '<td></tr>');
    });
    $("#distance > option:selected").each(function() {
        $('#tbody_distance_features').append('<tr><td>' + this.text + '<td></tr>');
    });
    $("#events > option:selected").each(function() {
        $('#tbody_events_features').append('<tr><td>' + this.text + '<td></tr>');
    });
 };

loadSummaryTracker = function() {
    var eyeTracker = $("#id_eye_tracker").val();
    $('#td_tracker_1').text(eyeTracker);

    if (eyeTracker == 'Tobii' || eyeTracker == 'TobiiV3'){
        var extraHeaderLines = $("#id_extra_header_lines").val();
        var fixationHeaderLines = $("#id_fixation_header_lines").val();
        var allDataHeaderLines = $("#id_all_data_header_lines").val();
        var eventsHeaderLines = $("#id_events_header_lines").val();
        var actionsHeaderLines = $("#id_actions_header_lines").val();

        $('#lbl_tracker_2').text('Extra header lines');
        $('#td_tracker_2').text(extraHeaderLines);

        $('#lbl_tracker_3').text('Fixation header lines');
        $('#td_tracker_3').text(fixationHeaderLines);

        $('#lbl_tracker_4').text('All data header lines');
        $('#td_tracker_4').text(allDataHeaderLines);

        $('#lbl_tracker_5').text('Events header lines');
        $('#td_tracker_5').text(eventsHeaderLines);

        $('#lbl_tracker_6').text('Actions header lines');
        $('#td_tracker_6').text(actionsHeaderLines);

        $('#tr_tracker_5, #tr_tracker_6').show();
    }
    else if (eyeTracker == 'SMI'){
        var eventsFirstDataLine = $("#id_events_first_data_line").val();
        var fixationHeaderLine = $("#id_fixation_header_line").val();
        var userEventHeaderLine = $("#id_user_event_header_line").val();

        $('#lbl_tracker_2').text('Events first data line');
        $('#td_tracker_2').text(eventsFirstDataLine);

        $('#lbl_tracker_3').text('Fixation header line');
        $('#td_tracker_3').text(fixationHeaderLine);

        $('#lbl_tracker_4').text('User event header line');
        $('#td_tracker_4').text(userEventHeaderLine);

        $('#tr_tracker_5, #tr_tracker_6').hide();
    }
};

loadSummaryValidity = function(){
    var validityMethod = $("#id_validity_method ").children(':selected').text();
    $('#td_validity_method').text(validityMethod);

    if (validityMethod == 'Time gap'){
        var timeThreshold = $("#id_valid_time_threshold").val();
        $('#lbl_validity_threshold').text('Valid time threshold');
        $('#td_validity_threshold').text(timeThreshold);
    }else{
        var proportionThreshold = $("#id_valid_proportion_threshold").val();
        $('#lbl_validity_threshold').text('Valid proportion threshold');
        $('#td_validity_threshold').text(proportionThreshold);
    }

    var offsetX = $("#id_media_offset_x").val();
    var offsetY = $("#id_media_offset_y").val();
    var pruneLength = $("#id_prune_length").val();

    $('#td_validity_offset_x').text(offsetX);
    $('#td_validity_offset_y').text(offsetY);
    $('#td_validity_prune_length').text(pruneLength);

    var autoPartition = $('#id_auto_partition_low_quality_segments').prop('checked');
    $('#td_validity_auto_partition').text(autoPartition ? 'Yes' : 'No');

    if (autoPartition){
        var minimumSegmentTime = $('#id_minimum_segment_time').val();
        $('#tr_validity_min_segment_time').show();
        $('#td_validity_min_segment_time').text(minimumSegmentTime);
    }
    else{
        $('#tr_validity_min_segment_time').hide();
    }

    var maximumSegmentTime = $('#id_maximum_segment_time').val();
    var exportNumSamples = $('#id_export_number_samples').prop('checked');
    var exportNumSegments = $('#id_export_number_segments').prop('checked');
    var includeHalfFixations = $('#id_include_half_fixations').prop('checked');
    var requireValidSegments = $('#id_require_valid_segments').prop('checked');

    $('#td_validity_max_segment_time').text(maximumSegmentTime);
    $('#td_validity_num_samples').text(exportNumSamples ? 'Yes' : 'No');
    $('#td_validity_num_segments').text(exportNumSegments ? 'Yes' : 'No');
    $('#td_validity_half_fixations').text(includeHalfFixations ? 'Yes' : 'No');
    $('#td_validity_valid_seg').text(requireValidSegments ? 'Yes' : 'No');

};

loadParticipants = function(){
    var minParticipant = $("#id_min_id_participant").val();
    var maxParticipant = $("#id_max_id_participant").val();
    var missingList = $("#id_missing_ids").val().replace(/ /g, '');
    var missingValues = missingList.split(",");

    $('#td_participant_range').text(minParticipant + ' - ' + maxParticipant);
    $('#td_participant_missing').text(missingList);

    var participantsList = [];
    for (var i = minParticipant; i <= maxParticipant; i++) {
        if (missingList.indexOf(i) == -1)
            participantsList.push(i);
    }

    loadWarningMessage(participantsList);
};

loadWarningMessage = function(participants){
    var fileList = $(idWarningMessage);
    fileList.empty();

    $.each( participants, function( key, value ) {
        fileList.append('<li>'+ value + '-All-Data.tsv</li>');
        fileList.append('<li>' + value + '-Event-Data.tsv</li>');
        fileList.append('<li>' + value + '-Fixation-Data.tsv</li>');
    });

    fileList.append('<li>all_rest_pupil_sizes.tsv</li>');
    fileList.append('<li>general.aoi</li>');
};

loadWizard = function(){
    wizard = $(idWizard);

    wizard.bootstrapWizard({
        'tabClass': 'bwizard-steps',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',
        onTabClick: function(tab, navigation, index, clicked) {

            var total = navigation.find('li').length;
            // If the user go back don't validate
            if (clicked <= index){
                // Disable tabs that are more than two steps from the current
                for (i = clicked+2; i < total; i++) {
                    wizard.bootstrapWizard('disable', i);
                }
                return true;
            } // go forward only one step
            else if (clicked > index+1){
                return false;
            }

            var $valid = $(idForm).valid();
            if(!$valid) {
                validator.focusInvalid();
                return false;
            }
            else{
                wizard.bootstrapWizard('enable', clicked+1);
            }

            return true;
        },
        'onNext': function(tab, navigation, index) {
            var $valid = $(idForm).valid();
            if(!$valid) {
                validator.focusInvalid();
                return false;
            }else{
                wizard.bootstrapWizard('enable', index+1);
            }

            // Scroll to the top of the wizard
            $('html, body').animate({ scrollTop: $(idWizard).offset().top }, 'slow');

            return true;
        },
        'onPrevious': function(){

            // Scroll to the top of the wizard
            $('html, body').animate({ scrollTop: $(idWizard).offset().top }, 'slow');

            return true;
        },
        onTabShow: function(tab, navigation, index) {

            var total = navigation.find('li').length;
            var current = index+1;

            if (current == 5){
                createSummary();
            }

            // If it's the last tab then hide the last button and show the finish instead
            if(current >= total) {
                wizard.find('.btn-next').hide();
                wizard.find('.btn-save').show();
            } else {
                wizard.find('.btn-next').show();
                wizard.find('.btn-save').hide();
            }

        }
    });

    wizard.bootstrapWizard('disable', 2);
    wizard.bootstrapWizard('disable', 3);
    wizard.bootstrapWizard('disable', 4);
};

saveParameters = function(){
    // Change button status
    $('.btn-save').on('click', function() {
        var $this = $(this);
        $this.button('loading');
        $(idForm).submit();
    });
};

$(document).ready(readySettings());