let talentData = {
	"currentClass": 0,
	"constants": {
		"imageDirectory": "assets/images/",
		"classIconDirectory": "class-icons/",
		"backgroundDirectory": "backrounds/",
		"skillIconDirectory": "skill-icons/",
	},
	"classes": [
		{
			"id": 0, 
			"name": "warrior", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-warrior.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Arms",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Heroic Strike", 
							"maxRank": 3, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-1.jpg",
							"position" : [1,1]
						},
						{ 
							"id": 1, 
							"name": "Deflection", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-2.jpg",
							"position" : [1,2]
						},
						{ 
							"id": 2, 
							"name": "Improved Rend", 
							"maxRank": 3, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-3.jpg",
							"position" : [1,3]
						},
						{ 
							"id": 3, 
							"name": "Improved Charge", 
							"maxRank": 2, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-4.jpg",
							"position" : [2,1]
						},
						{ 
							"id": 4, 
							"name": "Tactical Mastery", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-5.jpg",
							"position" : [2,2]
						},
						{ 
							"id": 5, 
							"name": "Improved Thunder Clap", 
							"maxRank": 3, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-6.jpg",
							"position" : [2,4]
						},
					]
				},
				{ 
					"id": 1,
					"name": "Fury",
					"skills": [
						{ 
							"id": 0,
							"name": "Booming Voice",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Protection",
					"skills": [
						{ 
							"id": 0,
							"name": "Sheild Specialization",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{
			"id": 1, 
			"name": "paladin", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-paladin.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Holy",
					"skills": [
						{ 
							"id": 0, 
							"name": "Divine Strength", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": [],
							"icon": "skill-warrior-2.jpg",
						},
					]
				},
				{ 
					"id": 1,
					"name": "Protection",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Devotion Aura",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Retribution",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Blessing of Might",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{ 
			"id": 2,
			"name": "hunter", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-hunter.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Beast Mastery",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Aspect of the Hawk", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": [
								"While Aspect of the Hawk is active, all normal ranged attacks have a 1% chance of increasing ranged attack speed by 30% for 12 sec.",
								"While Aspect of the Hawk is active, all normal ranged attacks have a 2% chance of increasing ranged attack speed by 30% for 12 sec.",
								"While Aspect of the Hawk is active, all normal ranged attacks have a 3% chance of increasing ranged attack speed by 30% for 12 sec.",
								"While Aspect of the Hawk is active, all normal ranged attacks have a 4% chance of increasing ranged attack speed by 30% for 12 sec.",
								"While Aspect of the Hawk is active, all normal ranged attacks have a 5% chance of increasing ranged attack speed by 30% for 12 sec."
							]
						},
						{ 
							"id": 1,
							"name": "Endurance Training",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						}
					]
				},
				{ 
					"id": 1,
					"name": "Marksmanship",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Concussive Shot",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
						{ 
							"id": 1, 
							"name": "Efficiency", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						}
					]
				},
				{ 
					"id": 2,
					"name": "Survival",
					"skills": [
						{ 
							"id": 0,
							"name": "Monster Slaying",
							"maxRank": 3,
							"currentRank": 0,
							"rankDescription": []
						}
					]
				}
			]
		},
		{ 
			"id": 3, 
			"name": "rogue", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-rogue.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Assassination",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Eviscerate", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Combat",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Gouge",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Subtlety",
					"skills": [
						{ 
							"id": 0,
							"name": "Master of Deception",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{
			"id": 4, 
			"name": "priest", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-priest.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Discipline",
					"skills": [
						{ 
							"id": 0, 
							"name": "Unbreakable Will", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Holy",
					"skills": [
						{ 
							"id": 0,
							"name": "Healing Focus",
							"maxRank": 2,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Shadow",
					"skills": [
						{ 
							"id": 0,
							"name": "Spirit Tap",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{
			"id": 5, 
			"name": "shaman", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-shaman.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Elemental",
					"skills": [
						{ 
							"id": 0, 
							"name": "Convection", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Enhancement",
					"skills": [
						{ 
							"id": 0,
							"name": "Ancestral Knowledge",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Restoration",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Healing Wave",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{ 
			"id": 6, 
			"name": "mage", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-mage.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Arcane",
					"skills": [
						{ 
							"id": 0, 
							"name": "Arcane Subtlety", 
							"maxRank": 2, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Fire",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Fireball",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Frost",
					"maxRank": 5,
					"currentRank": 0,
					"rankDescription": []
				}
			]
		},
		{
			"id": 7, 
			"name": "warlock", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-warlock.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Affliction",
					"skills": [
						{ 
							"id": 0, 
							"name": "Suppression", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Demonology",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Healthstone",
							"maxRank": 2,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Destruction",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Shadow Bolt",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
		{
			"id": 8, 
			"name": "druid", 
			"skillPoints": 51,
			"requiredLevel": 0,
			"icon": "icon-druid.png",
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Balance",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Wrath", 
							"maxRank": 5, 
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 1,
					"name": "Feral Combat",
					"skills": [
						{ 
							"id": 0,
							"name": "Ferocity",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				},
				{ 
					"id": 2,
					"name": "Restoration",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Mark of the Wild",
							"maxRank": 5,
							"currentRank": 0,
							"rankDescription": []
						},
					]
				}
			]
		},
	],
};