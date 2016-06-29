import csv
import os
from ..lib.emdat.utils import cast_int


def get_features_by_category():
    """
    Returns a dictionary with all the features by category
    """

    gaze =  [{'key':'length', 'name':'Length'},
             {'key':'numfixations', 'name':'Number of fixations'},
             {'key':'fixationrate', 'name':'Fixation rate'},
             {'key':'meanabspathangles', 'name':'Mean absolute path angles'},
             {'key':'meanfixationduration', 'name':'Mean fixation duration'},
             {'key':'meanpathdistance', 'name':'Mean path distance'},
             {'key':'meanrelpathangles', 'name':'Mean relative path angles'},
             {'key':'stddevabspathangles', 'name':'Standard deviation absolute path angles'},
             {'key':'stddevfixationduration', 'name':'Standard deviation fixation duration'},
             {'key':'stddevpathdistance', 'name':'Standard deviation path distance'},
             {'key':'stddevrelpathangles', 'name':'Standard deviation relative path angles'},
             {'key':'eyemovementvelocity', 'name':'Eye movement velocity'},
             {'key':'abspathanglesrate', 'name':'Absolute path angles rate'},
             {'key':'relpathanglesrate', 'name':'Relative path angles rate'},
             {'key':'sumabspathangles', 'name':'Sum absolute path angles'},
             {'key':'sumfixationduration', 'name':'Sum fixation duration'},
             {'key':'sumpathdistance', 'name':'Sum path distance'},
             {'key':'sumrelpathangles', 'name':'Sum relative path angles'}]

    aoi = [{'key':'fixationrate', 'name':'Fixation rate'},
           {'key':'numfixations', 'name':'Number of fixations'},
           {'key':'totaltimespent', 'name':'Total time spent'},
           {'key':'proportionnum', 'name':'Proportion number'},
           {'key':'proportiontime', 'name':'Proportion time'},
           {'key':'longestfixation', 'name':'Longest fixation'},
           {'key':'timetofirstfixation', 'name':'Time to first fixation'},
           {'key':'timetolastfixation', 'name':'Time to last fixation'},
           {'key':'numevents', 'name':'Number of events'},
           {'key':'numleftclic', 'name':'Number of left clic'},
           {'key':'numrightclic', 'name':'Number of right clic'},
           {'key':'numdoubleclic', 'name':'Number of double clic'},
           {'key':'leftclicrate', 'name':'Left clic rate'},
           {'key':'rightclicrate', 'name':'Right clic rate'},
           {'key':'doubleclicrate', 'name':'Double clic rate'},
           {'key':'timetofirstleftclic', 'name':'Time to first left clic'},
           {'key':'timetofirstrightclic', 'name':'Time to first right clic'},
           {'key':'timetofirstdoubleclic', 'name':'Time to first double clic'},
           {'key':'numtransfrom', 'name':'Number of transitions'},
           {'key':'proptransfrom', 'name':'Proportion of transitions'}]

    pupil = [{'key':'meanpupilsize', 'name':'Mean pupil size'},
             {'key':'stddevpupilsize', 'name':'Standard deviation pupil size'},
             {'key':'maxpupilsize', 'name':'Maximum pupil size'},
             {'key':'minpupilsize', 'name':'Minimum pupil size'},
             {'key':'startpupilsize', 'name':'Start pupil size'},
             {'key':'endpupilsize', 'name':'End pupil size'}]

    distance = [{'key':'meandistance', 'name':'Mean distance'},
                {'key':'stddevdistance', 'name':'Standard deviation distance'},
                {'key':'maxdistance', 'name':'Maximum distance'},
                {'key':'mindistance', 'name':'Minimum distance'},
                {'key':'startdistance', 'name':'Start distance'},
                {'key':'enddistance', 'name':'End distance'}]

    events = [{'key':'numevents', 'name':'Number of events'},
              {'key':'numleftclic', 'name':'Number of left clic'},
              {'key':'numrightclic', 'name':'Number of right clic'},
              {'key':'numdoubleclic', 'name':'Number of double clic'},
              {'key':'numkeypressed', 'name':'Number of key pressed'},
              {'key':'leftclicrate', 'name':'Left clic rate'},
              {'key':'rightclicrate', 'name':'Right clic rate'},
              {'key':'doubleclicrate', 'name':'Double clic rate'},
              {'key':'keypressedrate', 'name':'Key pressed rate'},
              {'key':'timetofirstleftclic', 'name':'Time to first left clic'},
              {'key':'timetofirstrightclic', 'name':'Time to first right clic'},
              {'key':'timetofirstdoubleclic', 'name':'Time to first double clic'},
              {'key':'timetofirstkeypressed', 'name':'Time to first key pressed'}]

    return {'gaze':gaze, 'aoi':aoi, 'pupil':pupil, 'distance':distance, 'events':events}


def get_info_feature(feature):
    """
    Returns all the information of the feature
    """

    features = {
        # Gaze
        'length': {'key':'length', 'name':'Length', 'unit':'Milliseconds', 'max':0, 'min':23},
        'numfixations': {'key':'numfixations', 'name':'Number of fixations', 'unit':'Count', 'max':0, 'min':23},
        'fixationrate': {'key':'fixationrate', 'name':'Fixation rate', 'unit':'Fixations / milliseconds', 'max':0, 'min':23},
        'meanabspathangles': {'key':'meanabspathangles', 'name':'Mean absolute path angles', 'unit':'Radians', 'max':0, 'min':23},
        'meanfixationduration': {'key':'meanfixationduration', 'name':'Mean fixation duration', 'unit':'Milliseconds', 'max':0, 'min':23},
        'meanpathdistance': {'key':'meanpathdistance', 'name':'Mean path distance', 'unit':'Pixels', 'max':0, 'min':23},
        'meanrelpathangles': {'key':'meanrelpathangles', 'name':'Mean relative path angles', 'unit':'Radians', 'max':0, 'min':23},
        'stddevabspathangles': {'key':'stddevabspathangles', 'name':'Standard deviation absolute path angles', 'unit':'Radians', 'max':0, 'min':23},
        'stddevfixationduration': {'key':'stddevfixationduration', 'name':'Standard deviation fixation duration', 'unit':'Milliseconds', 'max':0, 'min':23},
        'stddevpathdistance': {'key':'stddevpathdistance', 'name':'Standard deviation path distance', 'unit':'Pixels', 'max':0, 'min':23},
        'stddevrelpathangles': {'key':'stddevrelpathangles', 'name':'Standard deviation relative path angles', 'unit':'Radians', 'max':0, 'min':23},
        'eyemovementvelocity': {'key':'eyemovementvelocity', 'name':'Eye movement velocity', 'unit':'Pixels / milliseconds', 'max':0, 'min':23},
        'abspathanglesrate': {'key':'abspathanglesrate', 'name':'Absolute path angles rate', 'unit':'Radians / milliseconds', 'max':0, 'min':23},
        'relpathanglesrate': {'key':'relpathanglesrate', 'name':'Relative path angles rate', 'unit':'Radians / milliseconds', 'max':0, 'min':23},
        'sumabspathangles': {'key':'sumabspathangles', 'name':'Sum absolute path angles', 'unit':'Radians', 'max':0, 'min':23},
        'sumfixationduration': {'key':'sumfixationduration', 'name':'Sum fixation duration', 'unit':'Milliseconds', 'max':0, 'min':23},
        'sumpathdistance': {'key':'sumpathdistance', 'name':'Sum path distance', 'unit':'Pixels', 'max':0, 'min':23},
        'sumrelpathangles': {'key':'sumrelpathangles', 'name':'Sum relative path angles', 'unit':'Radians', 'max':0, 'min':23},
        # AOI
        'totaltimespent': {'key':'totaltimespent', 'name':'Total time spent', 'unit':'Milliseconds', 'max':0, 'min':23},
        'proportionnum': {'key':'proportionnum', 'name':'Proportion number', 'unit':'Percentage', 'max':0, 'min':23},
        'proportiontime': {'key':'proportiontime', 'name':'Proportion time', 'unit':'Percentage', 'max':0, 'min':23},
        'longestfixation': {'key':'longestfixation', 'name':'Longest fixation', 'unit':'Milliseconds', 'max':0, 'min':23},
        'timetofirstfixation': {'key':'timetofirstfixation', 'name': 'Time to first fixation', 'unit':'Milliseconds', 'max':0, 'min':23},
        'timetolastfixation': {'key':'timetolastfixation', 'name': 'Time to last fixation', 'unit':'Milliseconds', 'max':0, 'min':23},
        'numevents': {'key':'numevents', 'name': 'Number of events', 'unit':'Count', 'max':0, 'min':23},
        'numleftclic': {'key':'numleftclic', 'name': 'Number of left clic', 'unit':'Count', 'max':0, 'min':23},
        'numrightclic': {'key':'numrightclic', 'name': 'Number of right clic', 'unit':'Count', 'max':0, 'min':23},
        'numdoubleclic': {'key':'numdoubleclic', 'name': 'Number of double clic', 'unit':'Count', 'max':0, 'min':23},
        'leftclicrate': {'key':'leftclicrate', 'name': 'Left clic rate', 'unit':'Clic / milliseconds', 'max':0, 'min':23},
        'rightclicrate': {'key':'rightclicrate', 'name': 'Right clic rate', 'unit':'Clic / milliseconds', 'max':0, 'min':23},
        'doubleclicrate': {'key':'doubleclicrate', 'name': 'Double clic rate', 'unit':'Clic / milliseconds', 'max':0, 'min':23},
        'timetofirstleftclic': {'key':'timetofirstleftclic', 'name': 'Time to first left clic', 'unit':'Milliseconds', 'max':0, 'min':23},
        'timetofirstrightclic': {'key':'timetofirstrightclic', 'name': 'Time to first right clic', 'unit':'Milliseconds', 'max':0, 'min':23},
        'timetofirstdoubleclic': {'key': 'timetofirstdoubleclic', 'name': 'Time to first double clic', 'unit':'Milliseconds', 'max':0, 'min':23},
        'numtransfrom': {'key': 'numtransfrom', 'name': 'Number of transitions', 'unit':'Count', 'max':0, 'min':23},
        'proptransfrom': {'key': 'proptransfrom', 'name': 'Proportion of transitions', 'unit':'Percentage', 'max':0, 'min':23},
        # Pupil
        'meanpupilsize': {'key':'meanpupilsize', 'name': 'Mean pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        'stddevpupilsize': {'key':'stddevpupilsize', 'name': 'Standard deviation pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        'maxpupilsize': {'key':'maxpupilsize', 'name':'Maximum pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        'minpupilsize': {'key':'minpupilsize', 'name': 'Minimum pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        'startpupilsize': {'key':'startpupilsize', 'name': 'Start pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        'endpupilsize': {'key':'endpupilsize', 'name':'End pupil size', 'unit':'Millimeters', 'max':0, 'min':23},
        # Distance
        'meandistance': {'key':'meandistance', 'name': 'Mean distance', 'unit':'Centimeters', 'max':0, 'min':23},
        'stddevdistance': {'key':'stddevdistance', 'name': 'Standard deviation distance', 'unit':'Centimeters', 'max':0, 'min':23},
        'maxdistance': {'key':'maxdistance', 'name':'Maximum distance', 'unit':'Centimeters', 'max':0, 'min':23},
        'mindistance': {'key':'mindistance', 'name': 'Minimum distance', 'unit':'Centimeters', 'max':0, 'min':23},
        'startdistance': {'key':'startdistance', 'name': 'Start distance', 'unit':'Centimeters', 'max':0, 'min':23},
        'enddistance': {'key':'enddistance', 'name':'End distance', 'unit':'Centimeters', 'max':0, 'min':23},
        # Events
        'numkeypressed': {'key':'numkeypressed', 'name': 'Number of key pressed', 'unit':'Count', 'max':0, 'min':23},
        'keypressedrate': {'key':'keypressedrate', 'name': 'Key pressed rate', 'unit':'Key pressed / milliseconds', 'max':0, 'min':23},
        'timetofirstkeypressed': {'key':'timetofirstkeypressed', 'name': 'Time to first key pressed', 'unit':'Milliseconds', 'max':0, 'min':23},
    }

    return features[feature]


def read_csv_file_column(csv_file, column):
    """
    Read all the values of a CSV column
    """

    column_list = []

    with open(csv_file) as file:
         reader = csv.DictReader(file, delimiter='\t')
         for row in reader:
            column_list.append(row[column])

    return column_list


def read_aoi_file(aoi_file):
    """
    Read AOI file
    """
    aoi_names = []

    with open(aoi_file, 'r') as f:
        aoi_lines = f.readlines()

        for line in aoi_lines:
            chunks = line.strip().split('\t')
            if not chunks[0].startswith('#'):
                aoi_names.append(chunks[0])

    return aoi_names


def get_participants_ids(file, column_participant):
    """
    Get participants ids of the EMDAT output file
    """

    participants_ids = []

    column = read_csv_file_column(file, column_participant)

    for c in column:
        p_id = cast_int(c[1:])
        if (p_id):
            participants_ids.append(p_id)

    return participants_ids


def get_emdat_output_file(list_emdat_output_files):
    """
    Return the first EMDAT output file found it in the directory.
    """

    for output_file in list_emdat_output_files:
        if (os.path.exists(output_file)):
            return output_file

    return ''