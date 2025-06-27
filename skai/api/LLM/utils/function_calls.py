from ..Agent_Function.APOD.get_apod import get_apod
from ..Agent_Function.Neo.get_asteroid_info import get_asteroid_info
from ..Agent_Function.Neo.get_neo_feed import get_neo_feed
from ..Agent_Function.Donki.get_cme_analysis import get_cme_analysis

from ..Agent_Function.Donki.get_geomagnetic_storm import get_geomagnetic_storm
from ..Agent_Function.Donki.get_interplanetary_shock import get_interplanetary_shock
from ..Agent_Function.Donki.get_solar_flare import get_solar_flare
from ..Agent_Function.Donki.get_solar_energetic_particle import get_solar_energetic_particle
from ..Agent_Function.Donki.get_magnetopause_crossing import get_magnetopause_crossing
from ..Agent_Function.Donki.get_radiation_belt_enhancement import get_radiation_belt_enhancement
from ..Agent_Function.Donki.get_high_speed_stream import get_high_speed_stream
from ..Agent_Function.Donki.get_wsa_enlil_simulation import get_wsa_enlil_simulation
from ..Agent_Function.Donki.get_donki_notifications import get_donki_notifications

from ..Agent_Function.Tech_Transfer.tech_transfer import get_tech_transfer
from ..Agent_Function.Tech_Transfer.tech_transfer import get_tech_transfer_patent
from ..Agent_Function.Tech_Transfer.tech_transfer import get_tech_transfer_patent_issued
from ..Agent_Function.Tech_Transfer.tech_transfer import get_tech_transfer_software
from ..Agent_Function.Tech_Transfer.tech_transfer import get_tech_transfer_spinoff

def function_calls():
    functions = {
        "get_apod": get_apod,
        "get_asteroid_info": get_asteroid_info,
        "get_neo_feed": get_neo_feed,
        
        "get_cme_analysis": get_cme_analysis,
        "get_geomagnetic_storm": get_geomagnetic_storm,
        "get_interplanetary_shock": get_interplanetary_shock,
        "get_solar_flare": get_solar_flare,
        "get_solar_energetic_particle": get_solar_energetic_particle,
        "get_magnetopause_crossing": get_magnetopause_crossing,
        "get_radiation_belt_enhancement": get_radiation_belt_enhancement,
        "get_high_speed_stream": get_high_speed_stream,
        "get_wsa_enlil_simulation": get_wsa_enlil_simulation,
        "get_donki_notifications": get_donki_notifications,
        
        "get_tech_transfer": get_tech_transfer,
        "get_tech_transfer_patent": get_tech_transfer_patent,
        "get_tech_transfer_patent_issued": get_tech_transfer_patent_issued,
        "get_tech_transfer_software": get_tech_transfer_software,
        "get_tech_transfer_spinoff": get_tech_transfer_spinoff
    }
    
    return functions