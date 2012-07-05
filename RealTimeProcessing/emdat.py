'''
UBC Eye Movement Data Analysis Toolkit
Oliver Schmid - oliver.schmd@gmail.com

Programmatic interface for generating machine learning features from real-time Tobii data.  
'''
from EMDAT.data_structures import Datapoint, Fixation
from EMDAT import Recording, Segment

def generate_features(segment_id, raw_gaze_points, raw_fixations, raw_aois):
    '''
    Generates machine learning features from gaze points, raw_fixations and AOIs.
    
    @type segment_id: string
    @param segment_id: id for the segment
    
    @type raw_gaze_points: string
    @param raw_gaze_points: string formatted like lines from a Tobii all data export
    
    @type raw_fixations: string
    @param raw_fixations: string formatted like lines from a Tobii fixation export
    
    @type raw_aois: string 
    @param raw_aois: AOI definitions
    
    @return string listing features and their values. Each feature is on a new line
    and in the format: feature=value
    '''
    # test
    if True:
		return segment_id
    # test
    
    # convert inputs
    gaze_points = map(Datapoint, raw_gaze_points)
    gaze_points = filter(lambda x: x.number != None, gaze_points)
    fixations = map(lambda x: Fixation(x, 0), raw_fixations)
    aois = Recording.read_aois(raw_aois)
    
    # generate features
    segment = Segment(segment_id, gaze_points, fixations, aois)
    feature_names, feature_values = segment.get_features()
    
    features = ''
    for i in xrange(len(feature_names)):
        features += feature_names[i] + '=' + feature_values[i] + '\r\n'
    
    return features
