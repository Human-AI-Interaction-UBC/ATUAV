from django.shortcuts import render
from django.contrib import messages
from .forms import TrackerForm, TobiiForm, SMIForm, FeaturesForm, ValidityForm, ParticipantForm
from ..lib.emdat.BasicParticipant import *
from ..lib.emdat.Participant import write_features_tsv


# Create your views here.
def settings(request):

    tracker_form = TrackerForm
    tobii_form = TobiiForm
    smi_form = SMIForm
    features_form = FeaturesForm
    validity_form = ValidityForm
    participant_form = ParticipantForm

    general_features = (('length','Length'),
                        ('numfixations','Number of fixations'),
                        ('fixationrate','Fixation rate'),
                        ('meanabspathangles','Mean absolute angles'),
                        ('meanfixationduration','Mean fixation duration'),
                        ('meanpathdistance','Mean length of saccades'),
                        ('meanrelpathangles','Mean relative angles'),
                        ('stddevabspathangles','Standard deviation absolute angles'),
                        ('stddevfixationduration','Standard deviation fixation duration'),
                        ('stddevpathdistance','Standard deviation length of saccades'),
                        ('stddevrelpathangles','Standard deviation relative angles'),
                        ('eyemovementvelocity','Eye movement velocity'),
                        ('abspathanglesrate','Absolute angles rate'),
                        ('relpathanglesrate','Relative angles rate'),
                        ('sumabspathangles','Sum absolute angles'),
                        ('sumfixationduration','Sum fixation duration'),
                        ('sumpathdistance','Sum length saccades'),
                        ('sumrelpathangles','Sum relative angles'),
                        ('aoisequence', 'Sequences'))

    aoi_features = (('fixationrate','Fixation Rate'),
                    ('numfixations','Number of fixations'),
                    ('totaltimespent','Total time spent'),
                    ('proportionnum','Proportion number'),
                    ('proportiontime','Proportion time'),
                    ('longestfixation','Longest fixation'),
                    ('timetofirstfixation','Time to first fixation'),
                    ('timetolastfixation','Time to last fixation'),
                    ('numevents','Number of events'),
                    ('numleftclic','Number of left clic'),
                    ('numrightclic','Number right clic'),
                    ('numdoubleclic','Number of double clic'),
                    ('leftclicrate','Left clic rate'),
                    ('rightclicrate','Right clic rate'),
                    ('doubleclicrate','Double clic rate'),
                    ('timetofirstleftclic','Time to first left clic'),
                    ('timetofirstrightclic','Time to first right click'),
                    ('timetofirstdoubleclic','Time to first double clic'))

    pupil_features = (('meanpupilsize', 'Mean pupil size'),
                        ('stddevpupilsize','Standard deviation pupil size'),
                        ('maxpupilsize','Maximum pupil size'),
                        ('minpupilsize','Minimum pupil size'),
                        ('startpupilsize','Start pupil size'),
                        ('endpupilsize', 'End pupil size'))

    distance_features = (('meandistance','Mean distance'),
                         ('stddevdistance','Standard deviation distance'),
                         ('maxdistance','Maximum distance'),
                         ('mindistance','Minimum distance'),
                         ('startdistance','Start distance'),
                         ('enddistance','End distance'))

    events_features = (('numevents','Number of events'),
                       ('numleftclic','Number of left clic'),
                       ('numrightclic','Number of right clic'),
                       ('numdoubleclic','Number of double clic'),
                       ('numkeypressed','Number of key pressed'),
                       ('leftclicrate','Left clic rate'),
                       ('rightclicrate','Right clic rate'),
                       ('doubleclicrate','Double clic rate'),
                       ('keypressedrate','Key pressed rate'),
                       ('timetofirstleftclic','Time to first left clic'),
                       ('timetofirstrightclic','Time to first right clic'),
                       ('timetofirstdoubleclic','Time to first double clic'),
                       ('timetofirstkeypressed','Time to first key pressed'))

    if request.method == 'POST':

        form_data = request.POST

        try:
            range_participants = range(cast_int(form_data['min_id_participant']), cast_int(form_data['min_id_participant']) + 1)
            missing_ids = form_data['missing_ids']

            participants_list = set(range_participants) - set(missing_ids.split(','))

            set_params('Tobii2')

            # Process files
            ps = read_participants_Basic(user_list = participants_list, pids = participants_list, datadir=params.EYELOGDATAFOLDER,
                               prune_length = None,
                               aoifile = "apps/lib/emdat/sampledata/general.aoi",
                               require_valid_segs = False, auto_partition_low_quality_segments = True,
                               rpsfile = "apps/lib/emdat/sampledata/all_rest_pupil_sizes.tsv")

            # Write features to file
            aoi_feat_names = (map(lambda x:x, params.aoigeneralfeat))
            write_features_tsv(ps, 'apps/lib/emdat/outputfolder/sample_features.tsv', featurelist = params.featurelist, aoifeaturelist = aoi_feat_names, id_prefix = False)

            # Write AOI sequences to file
            write_features_tsv(ps, 'apps/lib/emdat/outputfolder/sample_sequences.tsv', featurelist = params.aoisequencefeat, aoifeaturelist = aoi_feat_names, id_prefix = False)

            messages.success(request, 'Analysis completed.')
        except Exception as e:
            messages.error(request, 'The request was unsuccessful. '+ str(e))

    return render(request, 'experiment/settings.html', {'tracker_form':tracker_form,
                                                        'tobii_form':tobii_form,
                                                        'smi_form':smi_form,
                                                        'features_form':features_form,
                                                        'participant_form':participant_form,
                                                        'general_features':general_features,
                                                        'aoi_features':aoi_features,
                                                        'pupil_features':pupil_features,
                                                        'distance_features':distance_features,
                                                        'events_features':events_features,
                                                        'validity_form':validity_form})
