// import React from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import NavDash from '@/components/nav-dash';

// interface BookItem {
//   title: string;
//   author: string;
// }

// interface MediaItem {
//   title: string;
//   description: string;
// }

// interface ResourceCategory {
//   category: string;
//   items: (BookItem | MediaItem)[];
// }

// const ResourceCard = () => {
//   const resources: ResourceCategory[] = [
//     {
//       category: "Books to Support Mental Wellness",
//       items: [
//         { title: "The Power of Now", author: "Eckhart Tolle" },
//         { title: "Atomic Habits", author: "James Clear" },
//         { title: "Feeling Good: The New Mood Therapy", author: "Dr. David D. Burns" }
//       ]
//     },
//     {
//       category: "Shows that Uplift and Inspire",
//       items: [
//         { title: "Queer Eye", description: "A show about transformation and self-acceptance" },
//         { title: "The Good Place", description: "A comedic exploration of morality and personal growth" }
//       ]
//     },
//     {
//       category: "Movies for Reflection and Comfort",
//       items: [
//         { title: "Inside Out", description: "A Pixar film exploring emotions and mental health" },
//         { title: "A Beautiful Mind", description: "The story of resilience and overcoming mental illness" }
//       ]
//     },
//     {
//       category: "Other Mental Health Resources",
//       items: [
//         { title: "Headspace", description: "A meditation app for relaxation and mindfulness" },
//         { title: "7 Cups", description: "Free online emotional support chat with trained listeners" },
//         { title: "National Alliance on Mental Illness (NAMI)", description: "Mental health resources and support groups" }
//       ]
//     }
//   ];

//   const getItemSubtext = (item: BookItem | MediaItem): string => {
//     if ('author' in item) {
//       return item.author;
//     }
//     return item.description;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       <NavDash />
//       <main className="container mx-auto py-12 px-4">
//         <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
//           Mental Wellness Resources
//         </h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {resources.map((resource, index) => (
//             <Card 
//               key={index} 
//               className="hover:shadow-xl transition-shadow duration-300"
//             >
//               <CardContent className="p-6">
//                 <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//                   {resource.category}
//                 </h2>
//                 <ul className="space-y-4">
//                   {resource.items.map((item, idx) => (
//                     <li key={idx} className="border-b last:border-b-0 pb-3 last:pb-0">
//                       <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//                         {item.title}
//                       </p>
//                       <p className="text-gray-600 dark:text-gray-400 mt-1">
//                         {getItemSubtext(item)}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ResourceCard;
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import NavDash from '@/components/nav-dash';

interface BookItem {
  title: string;
  author: string;
}

interface MediaItem {
  title: string;
  description: string;
}

interface ResourceCategory {
  category: string;
  items: (BookItem | MediaItem)[];
}

const ResourceCard = () => {
  const resources: ResourceCategory[] = [
    {
      category: "Books to Support Mental Wellness",
      items: [
        { title: "The Power of Now", author: "Eckhart Tolle" },
        { title: "Atomic Habits", author: "James Clear" },
        { title: "Feeling Good: The New Mood Therapy", author: "Dr. David D. Burns" }
      ]
    },
    {
      category: "Shows that Uplift and Inspire",
      items: [
        { title: "Queer Eye", description: "A show about transformation and self-acceptance" },
        { title: "The Good Place", description: "A comedic exploration of morality and personal growth" }
      ]
    },
    {
      category: "Movies for Reflection and Comfort",
      items: [
        { title: "Inside Out", description: "A Pixar film exploring emotions and mental health" },
        { title: "A Beautiful Mind", description: "The story of resilience and overcoming mental illness" }
      ]
    },
    {
      category: "Other Mental Health Resources",
      items: [
        { title: "Headspace", description: "A meditation app for relaxation and mindfulness" },
        { title: "7 Cups", description: "Free online emotional support chat with trained listeners" },
        { title: "National Alliance on Mental Illness (NAMI)", description: "Mental health resources and support groups" }
      ]
    }
  ];

  const getItemSubtext = (item: BookItem | MediaItem): string => {
    if ('author' in item) {
      return item.author;
    }
    return item.description;
  };

  const getGoogleSearchLink = (title: string): string => {
    return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavDash />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Mental Wellness Resources
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {resource.category}
                </h2>
                <ul className="space-y-4">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <a
                        href={getGoogleSearchLink(item.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {item.title}
                      </a>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {getItemSubtext(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ResourceCard;
