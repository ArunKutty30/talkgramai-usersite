export const conversation = [
  {
    title: "Personal Information",
    objective: "Discuss personal details like age, nationality, and occupation.",
    age: [
      [
        {
          sentence: "I am [age] years old",
          example: "My age is 25",
        },
        {
          sentence: "My age is [age]",
          example: "My age is 25",
        },
        {
          sentence: "I was born in [year].",
          example: "I was born in [year].",
        },
      ],
      [
        {
          term: "Age",
          speech: "Noun",
          meaning: "The number of years a person has lived.",
        },
        {
          term: "Young",
          speech: "Adjective",
          meaning: "Having lived for a relatively short time in comparison to others.",
        },
        {
          term: "Old",
          speech: "Adjective",
          meaning: "Having lived for a long time; not young.",
        },
        {
          term: "Teenager",
          speech: "Noun",
          meaning: "A person aged between 13 and 19.",
        },
        {
          term: "Adult",
          speech: "Noun",
          meaning: "A person who is fully grown or developed and has reached maturity.",
        },
        {
          term: "Elderly",
          speech: "Adjective",
          meaning:
            "A polite term to describe older people, often referring to those over the age of 65.",
        },
        {
          term: "Senior",
          speech: "Noun/Adjective",
          meaning:
            "A person who is older or has a higher status, particularly in the context of work or education.",
        },
        {
          term: "Youthful",
          speech: "Adjective",
          meaning: "Having qualities associated with youth, such as vitality and energy.",
        },
        {
          term: "Maturity",
          speech: "Noun",
          meaning:
            "The state of being fully grown or developed, often referring to emotional or mental development.",
        },
        {
          term: "Middle-aged",
          speech: "Adjective",
          meaning: "A person aged about 45 to 65.",
        },
      ],
    ],
    nationality: [
      [
        {
          sentence: "I am [nationality]",
          example: "I am American.",
        },
        {
          sentence: "I come from [country]",
          example: "I come from France.",
        },
        {
          sentence: "What is your nationality?",
          example: "I hold Canadian citizenship.",
        },
        {
          sentence: "I hold [nationality] citizenship.",
          example: "I hold Canadian citizenship.",
        },
      ],
      [
        {
          term: "Nationality",
          speech: "Noun",
          meaning: "The legal status or membership of a person in a specific nation or country.",
        },
        {
          term: "Country",
          speech: "Noun",
          meaning: "A nation with its government, territory, and people.",
        },
        {
          term: "Citizen",
          speech: "Noun",
          meaning: "A legally recognized member of a country, having rights and responsibilities.",
        },
        {
          term: "Passport",
          speech: "Noun",
          meaning:
            "An official document issued by a government to identify a person's nationality and facilitate international travel.",
        },
        {
          term: "Immigrant",
          speech: "Noun",
          meaning:
            "A person who has moved to a foreign country with the intention of living there.",
        },
        {
          term: "Dual citizenship",
          speech: "Noun",
          meaning: "The status of being a citizen of two countries.",
        },
        {
          term: "Heritage",
          speech: "Noun",
          meaning:
            "The cultural, historical, and family background passed down through generations.",
        },
        {
          term: "Naturalization",
          speech: "Noun",
          meaning: "The process by which a foreign citizen becomes a citizen of a new country.",
        },
        {
          term: "Ancestry",
          speech: "Noun",
          meaning: "One's family or ethnic background, including ancestors.",
        },
      ],
    ],
    occupation: [
      [
        {
          sentence: "I work as a [occupation].",
          example: 'Example: "I work as a teacher."',
        },
        {
          sentence: "My job is [occupation].",
          example: 'Example: "My job is a software engineer."',
        },
        {
          sentence: "What do you do for a living?",
          example: 'Example: "What do you do for a living?"',
        },
        {
          sentence: "I am employed as [occupation].",
          example: 'Example: "I am employed as a nurse."',
        },
        {
          sentence: "I am [age] years old, and I am [nationality].",
          example: 'Example: "I am 35 years old, and I am Italian."',
        },
        {
          sentence: "My age is [age], and I work as a [occupation].",
          example: 'Example: "My age is 28, and I work as a lawyer."',
        },
        {
          sentence: "I come from [country], and I am employed as a [occupation].",
          example: 'Example: "I come from Brazil, and I am employed as a graphic designer."',
        },
      ],
      [
        {
          term: "Occupation",
          speech: "Noun",
          meaning: "A persons job or profession.",
        },
      ],
    ],
    name: [
      [
        {
          sentence: "What's your name?",
          example: "My name is John.",
        },
      ],
      [
        {
          term: "Name",
          speech: "Noun",
          meaning: "A word or words by which an individual is known, addressed, or referred to.",
        },
        {
          term: "Given name/First name",
          speech: "Noun",
          meaning: "The name given to a person at birth or during a naming ceremony.",
        },
        {
          term: "Surname/Last name",
          speech: "Noun",
          meaning: "The family name that is typically shared by all members of a family.",
        },
        {
          term: "Nickname",
          speech: "Noun",
          meaning: "A familiar or humorous name given to a person instead of their real name.",
        },
      ],
    ],
    location: [
      [
        {
          sentence: "Where are you from?",
          example: " I come from New York.",
        },
      ],
      [
        {
          term: "Hometown",
          speech: "Noun",
          meaning: "The place where a person was born or grew up.",
        },
        {
          term: "Current location",
          speech: "Noun",
          meaning: "The place where a person currently lives.",
        },
        {
          term: "Residence",
          speech: "Noun",
          meaning: "The place where someone lives or stays.",
        },
      ],
    ],
    HobbiesAndInterests: [
      [
        {
          sentence: "I enjoy [Your Hobbies or Interests].",
          example: "I enjoy painting and playing the guitar",
        },
      ],
    ],
    family: [
      [
        {
          sentence: "Do you have any siblings?",
          example: "Yes, I have [Number of Siblings] [Brothers/Sisters]",
        },
      ],
    ],
    education: [
      [
        {
          sentence: "What's your educational background?",
          example: "I graduated from Harvard University with a degree in psychology.",
        },
      ],
    ],
    martialStatus: [
      [
        {
          sentence: "Are you married or single?",
          example: "I am married",
        },
      ],
      [
        {
          term: "Marital status",
          speech: "Noun",
          meaning: "The state of being single, married, divorced, or widowed.",
        },
        {
          term: "Single",
          speech: "Adjective",
          meaning: "Not married or in a committed relationship.",
        },
        {
          term: "Married",
          speech: "Adjective",
          meaning: "Legally joined in matrimony to another person.",
        },
        {
          term: "Divorced",
          speech: "Adjective",
          meaning: "Legally separated from a spouse.",
        },
        {
          term: "Widowed",
          speech: "Adjective",
          meaning: "Having lost a spouse due to death.",
        },
      ],
    ],
  },
  {
    title: "Greetings and Introductions",
    objective:
      'Master greetings: "hello," "hi," "good morning," "good afternoon," "good evening," and "goodbye."',
    informalGreetings: [
      [
        {
          sentence: "Hi, [Name]!",
          example: 'Example: "Hi, Sarah!"',
        },
        {
          sentence: "Hey there, [Name]!",
          example: 'Example: "Hey there, Mark!"',
        },
        {
          sentence: "Hello, [Name]!",
          example: 'Example: "Hello, Emily!"',
        },
        {
          sentence: "Hi, how are you?",
          example: 'Example: "Hi, how are you, Tom?"',
        },
        {
          sentence: "Hey, how's it going?",
          example: 'Example: "Hey, how\'s it going, Lisa?"',
        },
      ],
      [
        {
          term: "Hey",
          speech: "Interjection",
          meaning: "An informal and casual way to get someone's attention or say hello.",
        },
        {
          term: "Howdy",
          speech: "Interjection",
          meaning:
            "A casual and friendly greeting, often associated with American Western culture.",
        },
        {
          term: "What's up?",
          speech: "Phrase",
          meaning: "An informal way to ask someone how they are or what they are doing.",
        },
        {
          term: "Nice to meet you",
          speech: "Phrase",
          meaning: "A polite way to express pleasure in meeting someone for the first time.",
        },
        {
          term: "Pleasure to meet you",
          speech: "Phrase",
          meaning: "A formal way to express pleasure in meeting someone for the first time.",
        },
      ],
    ],
    formalGreetings: [
        [
      {
        sentence: "Good morning, [Name].",
        example: 'Example: "Good morning, Mr. Johnson."',
      },
      {
        sentence: "Good afternoon, [Name].",
        example: 'Example: "Good afternoon, Mrs. Smith."',
      },
      {
        sentence: "Good evening, [Name].",
        example: 'Example: "Good evening, Dr. Davis."',
      },
      {
        sentence: "Hello, how are you today?",
        example: 'Example: "Hello, how are you today, Professor Anderson?"',
      },
      {
        sentence: "How do you do?",
        example: 'Example: "How do you do, Miss White?"',
      },
    ],
    [
        {
            "term": "Sir",
            "speech": "Noun",
            "meaning": "A formal title of respect used when addressing a man."
          },
          {
            "term": "Madam",
            "speech": "Noun",
            "meaning": "A formal title of respect used when addressing a woman."
          },
          {
            "term": "Mr.",
            "speech": "Abbreviation",
            "meaning": "A formal title used before a man's last name."
          },
          {
            "term": "Mrs.",
            "speech": "Abbreviation",
            "meaning": "A formal title used before a married woman's last name."
          },
          {
            "term": "Miss",
            "speech": "Noun",
            "meaning": "A formal title used before a woman's last name when her marital status is unknown."
          },
          {
            "term": "Ms.",
            "speech": "Abbreviation",
            "meaning": "A formal title used before a woman's last name regardless of her marital status."
          },
          {
            "term": "Good day",
            "speech": "Phrase",
            "meaning": "A formal greeting used during the day."
          }
    ]
],
    greetingsInSocialSettings:[
        [
            {
                "sentence": "Hi, everyone!",
                "example": "Example: \"Hi, everyone at the party!\""
              },
              {
                "sentence": "Hello, everybody!",
                "example": "Example: \"Hello, everybody at the gathering!\""
              },
              {
                "sentence": "Hey, folks!",
                "example": "Example: \"Hey, folks at the event!\""
              },
              {
                "sentence": "Hi there, friends!",
                "example": "Example: \"Hi there, friends at the picnic!\""
              }
        ],
        [
            
        ]
    ]

  },
];
