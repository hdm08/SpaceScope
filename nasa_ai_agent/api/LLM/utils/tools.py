function_tools = [
        {
            "type": "function",
            "function": {
                "name": "get_apod",
                "description": "Fetches NASA's Astronomy Picture of the Day (APOD) for a specific date.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string",
                            "description": "Date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": []
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_wikipedia_data",
                "description": "Fetches a Wikipedia summary for a NASA-related query.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to append with ' NASA'."
                        }
                    },
                    "required": ["query"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_asteroid_info",
                "description": "Fetches information about a specific asteroid from NASA's NEO API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "asteroid_id": {
                            "type": "integer",
                            "description": "The SPK-ID of the asteroid (e.g., 3542519)."
                        }
                    },
                    "required": ["asteroid_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_neo_feed",
                "description": "Fetches a list of Near Earth Objects (NEOs) based on their closest approach date to Earth.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to 7 days after start_date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_cme_analysis",
                "description": "Fetches Coronal Mass Ejection (CME) Analysis data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        },
                        "most_accurate_only": {
                            "type": "boolean",
                            "description": "Return only the most accurate analysis. Defaults to true."
                        },
                        "complete_entry_only": {
                            "type": "boolean",
                            "description": "Return only complete entries. Defaults to true."
                        },
                        "speed": {
                            "type": "integer",
                            "description": "Lower limit for CME speed. Defaults to 0."
                        },
                        "half_angle": {
                            "type": "integer",
                            "description": "Lower limit for CME half angle. Defaults to 0."
                        },
                        "catalog": {
                            "type": "string",
                            "description": "Catalog type. Defaults to 'ALL'. Choices: ALL, SWRC_CATALOG, JANG_ET_AL_CATALOG.",
                            "enum": ["ALL", "SWRC_CATALOG", "JANG_ET_AL_CATALOG"]
                        },
                        "keyword": {
                            "type": "string",
                            "description": "Keyword filter. Defaults to 'NONE'. Example: swpc_annex."
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_geomagnetic_storm",
                "description": "Fetches Geomagnetic Storm (GST) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_interplanetary_shock",
                "description": "Fetches Interplanetary Shock (IPS) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": 'Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.',
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        },
                        "location": {
                            "type": "string",
                            "description": "Location filter. Defaults to 'ALL'. Choices: ALL, Earth, MESSENGER, STEREO A, STEREO B.",
                            "enum": ["ALL", "Earth", "MESSENGER", "STEREO A", "STEREO B"]
                        },
                        "catalog": {
                            "type": "string",
                            "description": "Catalog type. Defaults to 'ALL'. Choices: ALL, SWRC_CATALOG, WINSLOW_MESSENGER_ICME_CATALOG.",
                            "enum": ["ALL", "SWRC_CATALOG", "WINSLOW_MESSENGER_ICME_CATALOG"]
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_solar_flare",
                "description": "Fetches Solar Flare (FLR) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_solar_energetic_particle",
                "description": "Fetches Solar Energetic Particle (SEP) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_magnetopause_crossing",
                "description": "Fetches Magnetopause Crossing (MPC) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_radiation_belt_enhancement",
                "description": "Fetches Radiation Belt Enhancement (RBE) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_high_speed_stream",
                "description": "Fetches High Speed Stream (HSS) data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_wsa_enlil_simulation",
                "description": "Fetches WSA+Enlil Simulation data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_donki_notifications",
                "description": "Fetches Notifications data from NASA's DONKI API.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_date": {
                            "type": "string",
                            "description": "Starting date in YYYY-MM-DD format. If not provided, defaults to today.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "Optional ending date in YYYY-MM-DD format. Defaults to current UTC date.",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        },
                        "type": {
                            "type": "string",
                            "description": "Notification type. Defaults to 'all'. Choices: all, FLR, SEP, CME, IPS, MPC, GST, RBE, report.",
                            "enum": ["all", "FLR", "SEP", "CME", "IPS", "MPC", "GST", "RBE", "report"]
                        }
                    },
                    "required": ["start_date"]
                }
            }
        },
        {
        "type": "function",
        "function": {
            "name": "get_tech_transfer",
            "description": "Fetches data from NASA's Tech Transfer API for patents, patent issuance, software, or spinoffs.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patent": {
                        "type": "string",
                        "description": "String to search for matching patents."
                    },
                    "patent_issued": {
                        "type": "string",
                        "description": "String to search within patent issuance information."
                    },
                    "software": {
                        "type": "string",
                        "description": "String to search for NASA software."
                    },
                    "spinoff": {
                        "type": "string",
                        "description": "String to search for spinoff examples."
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_tech_transfer_patent",
            "description": "Fetches patents from NASA's Tech Transfer API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patent": {
                        "type": "string",
                        "description": "String to search for matching patents."
                    }
                },
                "required": ["patent"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_tech_transfer_patent_issued",
            "description": "Fetches patent issuance information from NASA's Tech Transfer API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patent_issued": {
                        "type": "string",
                        "description": "String to search within patent issuance information."
                    }
                },
                "required": ["patent_issued"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_tech_transfer_software",
            "description": "Fetches NASA software from NASA's Tech Transfer API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "software": {
                        "type": "string",
                        "description": "String to search for NASA software."
                    }
                },
                "required": ["software"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_tech_transfer_spinoff",
            "description": "Fetches spinoff examples from NASA's Tech Transfer API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "spinoff": {
                        "type": "string",
                        "description": "String to search for spinoff examples."
                    }
                },
                "required": ["spinoff"]
            }
        }
    }
    ]
        