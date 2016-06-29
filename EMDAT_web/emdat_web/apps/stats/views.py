import os
from django.http import FileResponse
from django.conf import settings
from django.shortcuts import render
from ..commons.utility import get_features_by_category, get_info_feature, read_aoi_file, get_participants_ids, get_emdat_output_file
from .forms import StatsForm


def index(request):
    """
    Show visualization interface
    """

    stats_form = StatsForm

    error_files_messages = []
    column_participant =  settings.EMDAT_COLUMN_PARTICIPANT
    emdat_output_folder =  os.path.join(settings.BASE_DIR, settings.EMDAT_OUTPUT_FOLDER)
    participants_ids = []

    # List output files with different eye trackers
    list_output_files = []
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_TOBII))
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_TOBIIV3))
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_SMI))

    # Search EMDAT output files
    emdat_output_file = get_emdat_output_file(list_output_files)

    # Get list of participants or append error
    if (emdat_output_file):
        participants_ids = get_participants_ids(emdat_output_file, column_participant)
    else:
        error_files_messages.append('EMDAT output file')

    # Get list of AOI
    aoi_file =  os.path.join(settings.BASE_DIR, settings.EMDAT_AOI_FILE)
    aoi_names = []

    if (os.path.exists(aoi_file)):
        aoi_names = read_aoi_file(aoi_file)
    else:
        error_files_messages.append('Definition of AOI file')

    # Get list of features by category
    all_features = get_features_by_category()

    # Options selected
    selected_participants, selected_features, selected_features_info, selected_aoi_features = [], [], [], []

    # Flag to indicate if plot 1 or 2 charts per row
    panel_small = True

    # If EMDAT output file exist and if is a POST request
    if not error_files_messages and request.method == 'POST':
        selected_participants = [int(participant) for participant in request.POST.getlist('select_participants')]

        if len(selected_participants) > 6:
           panel_small = False

        # Split selected features for 1st and 2nd column
        selected_features = [str(feature) for feature in request.POST.getlist('select_features')]
        selected_features_info = [get_info_feature(feature) for feature in selected_features]

        #selected_aoi_features = []

    return render(request, 'stats/index.html', {'stats_form':stats_form,
                                                'aoi_names':aoi_names,
                                                'error_files_messages':error_files_messages,
                                                'column_participant':column_participant,
                                                'participants_ids':participants_ids,
                                                'selected_participants':selected_participants,
                                                'selected_features':selected_features,
                                                'selected_features_info':selected_features_info,
                                                'selected_aoi_features':selected_aoi_features,
                                                'gaze_features':all_features['gaze'],
                                                'aoi_features':all_features['aoi'],
                                                'pupil_features':all_features['pupil'],
                                                'distance_features':all_features['distance'],
                                                'events_features':all_features['events'],
                                                'panel_small':panel_small})


def emdat_output(request):
    """
    Returns the EMDAT output CSV file
    """

    emdat_output_folder =  os.path.join(settings.BASE_DIR, settings.EMDAT_OUTPUT_FOLDER)

    # List output files with different eye trackers
    list_output_files = []
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_TOBII))
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_TOBIIV3))
    list_output_files.append(os.path.join(emdat_output_folder, settings.EMDAT_OUTPUT_FILE_SMI))

    # Search EMDAT output files
    emdat_output_file = get_emdat_output_file(list_output_files)

    response = FileResponse(open(emdat_output_file, 'rb'))
    response['Content-Disposition'] = 'attachment; filename="emdat.csv"'

    return response
