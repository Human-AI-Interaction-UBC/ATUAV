from django.shortcuts import render
from django.contrib import messages
from .forms import TrackerForm, TobiiForm, SMIForm, FeaturesForm, ValidityForm, ParticipantForm
from ..commons.utility import get_features_by_category
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

    all_features = get_features_by_category()

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
                                                        'gaze_features':all_features['gaze'],
                                                        'aoi_features':all_features['aoi'],
                                                        'pupil_features':all_features['pupil'],
                                                        'distance_features':all_features['distance'],
                                                        'events_features':all_features['events'],
                                                        'validity_form':validity_form})
