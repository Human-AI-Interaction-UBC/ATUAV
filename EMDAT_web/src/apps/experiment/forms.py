from django import forms

EYE_TRACKERS = (
    ('Tobii', 'Tobii'),
    ('TobiiV3', 'Tobii V3'),
    ('SMI', 'SMI'),
)

# Step 1
class TrackerForm(forms.Form):
    eye_tracker = forms.ChoiceField(choices=EYE_TRACKERS, widget=forms.Select(attrs={'class':'form-control', 'autofocus':'autofocus'}))


class TobiiForm(forms.Form):
    extra_header_lines = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                         help_text='Number of extra lines at the beginning of the files exported from Tobii. This is specific to study and is based on the number of variables defined in Tobii studio for the experiment. <hr> Default: 8',
                                         initial=8)
    fixation_header_lines = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                            help_text='Number of lines at the beginning of the "Fixation-Data" files exported from Tobii before the actual data. <hr> Default: 19',
                                            initial=19)
    all_data_header_lines = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                            help_text='Number of lines at the beginning of the "All-Data" files exported from Tobii before the actual data. <hr> Default: 26',
                                            initial=26)
    events_header_lines = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='Number of lines at the beginning of the "Event-Data" files exported from Tobii before the actual data. <hr> Default: 27',
                                          initial=27)
    actions_header_lines = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                           help_text='Number of lines at the beginning of the external log files before the actual data. <hr> Default: 0',
                                           initial=0)


class SMIForm(forms.Form):
    events_first_data_line = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                           help_text='The line number of the first data row in Events file. <hr> Default: 22',
                                           initial=22)
    fixation_header_line = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                           help_text='The line number of the row that contains the table header for fixations. <hr> Default: 11',
                                           initial=11)
    user_event_header_line = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                           help_text='The line number of the row that contains the table header for user events. <hr> Default: 20',
                                           initial=20)


# Step 2
class FeaturesForm(forms.Form):
    general = forms.Field(required=False)
    aoi = forms.Field(label='AOI', required=False)
    pupil = forms.Field(required=False)
    distance = forms.Field(required=False)
    events = forms.Field(required=False)


VALIDITY_METHODS = (
    (1, 'Proportion'),
    (2, 'Time gap'),
    (3, 'Proportion with valid + restored samples')
)

# Step 3
class ValidityForm(forms.Form):
    validity_method = forms.ChoiceField(choices=VALIDITY_METHODS, widget=forms.Select(attrs={'class':'form-control'}),
                                        help_text='<a target="_blank" href="http://127.0.0.1:8000/documentation/"><i class="fa fa-file-text"></i> Documentation</a> <br> <b>Proportion</b> and <b>proportion with valid and restored samples</b> use "validity proportion threshold". <br> <b>Time gap</b> uses "valid time threshold". <br> <br> Restored samples are the samples which are not valid but they are part of a Fixation. The idea is that if the user was looking at a certain point and then we loose the eye data for a short period of time and afterwards the user is looking at the same point we can assume that user was looking at that same point during that period. <hr> Default: Proportion')
    valid_proportion_threshold = forms.DecimalField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='Validity threshold for segments. <hr> Default: 0.85 <br> Recommended: 0.80 - 1',
                                          initial=0.85)
    valid_time_threshold = forms.DecimalField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='The maximum gap size in milliseconds allowable in samples for a Segment or Scene to be considered valid. <hr> Default: 3000 <br> Recommended: 3000 - 6000',
                                          initial=3000)
    media_offset_x = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}), label='Media offset X',
                                           help_text='X coordinate of the left corner of the window. <hr> Default: 0 (full screen)',
                                           initial=0)
    media_offset_y = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}), label='Media offset Y',
                                           help_text='Y coordinate of the top corner of the window. <hr> Default: 0 (full screen)',
                                           initial=0)
    prune_length = forms.DecimalField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='An integer that specifies the time interval in milliseconds from the beginning of each Segment in which samples are considered in calculations.  This can be used if, for example, you only wish to consider data in the first 1000ms of each Segment. In this case <b>prune length</b> = 1000, all data beyond the first 1000ms of the start of the "Segment"s will be disregarded.<hr> Default: < empty >',
                                          required=False)
    auto_partition_low_quality_segments = forms.BooleanField(help_text='Auto-partition option is when EMDAT automatically splits the "Segment"s which have low sample quality, into two new sub "Segment"s discarding the largest gap of invalid samples for a "Segment". EMDAT will continue to perform the splitting on the Segments until there is notany gap larger than <b>maximum segment time</b> left in the data. <hr> Default: Yes',
                                                             initial=True)
    minimum_segment_time = forms.DecimalField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='Minimum segment size in milliseconds that is considered meaningful for this experiment. <hr> Default: 300 <br> Recommended: 300 - 600',
                                          initial=300)
    maximum_segment_time = forms.DecimalField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                          help_text='Maximum gap size in milliseconds allowable in a segment. <hr> Default: 300 <br> Recommended: 300 - 600',
                                          initial=300)
    export_number_samples = forms.BooleanField(label='Export number of samples')
    export_number_segments = forms.BooleanField(label='Export number of segments')
    include_half_fixations = forms.BooleanField()
    require_valid_segments = forms.BooleanField()


# Step 4
class ParticipantForm(forms.Form):
    min_id_participant = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}), label='Min participant ID',
                                           help_text='An integer with the first ID of a range of participants. <hr> Default: 1',
                                           initial=1)
    max_id_participant = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}), label='Max participant ID',
                                           help_text='An integer with the last ID of a range of participants. <hr> Default: 3',
                                           initial=1)
    missing_ids = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control'}), label='Missing IDs',
                                    help_text='A comma separated values list with the missing participants IDs. (e.g., 5,8,13). <hr> Default: < empty >',
                                    required=False)

