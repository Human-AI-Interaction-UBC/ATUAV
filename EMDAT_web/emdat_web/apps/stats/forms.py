from django import forms


class StatsForm(forms.Form):
    participants = forms.Field(label='Participants (max. 12) ',required=True)
    features = forms.Field(label='Features', required=True)
    aoi_features = forms.Field(label='AOI Features',required=True)
