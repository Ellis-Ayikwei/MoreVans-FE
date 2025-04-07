import React from 'react';
import {
  faBox,
  faMusic,
  faCouch,
  faTv,
  faBlender,
  faWineGlassAlt,
  faDumbbell,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';

export type ItemCategory = 'furniture' | 'electronics' | 'appliances' | 'musical' | 'boxes' | 'fragile' | 'exercise' | 'garden';

export const getItemIcon = (category: string) => {
  const validCategory = isValidCategory(category) ? category : 'boxes';
  
  const colors = {
    furniture: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    electronics: 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200',
    appliances: 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200',
    boxes: 'bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-200',
    musical: 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200',
    fragile: 'bg-pink-100 text-pink-500 dark:bg-pink-800 dark:text-pink-200',
    exercise: 'bg-teal-100 text-teal-500 dark:bg-teal-800 dark:text-teal-200',
    garden: 'bg-lime-100 text-lime-500 dark:bg-lime-800 dark:text-lime-200',
  };

  const tabColor = {
    furniture: 'bg-blue-500 text-blue-100 dark:bg-blue-800 dark:text-blue-200',
    electronics: 'bg-green-500 text-green-100 dark:bg-green-800 dark:text-green-200',
    appliances: 'bg-yellow-500 text-yellow-100 dark:bg-yellow-800 dark:text-yellow-200',
    boxes: 'bg-orange-500 text-orange-100 dark:bg-orange-800 dark:text-orange-200',
    musical: 'bg-red-500 text-red-100 dark:bg-red-800 dark:text-red-200',
    fragile: 'bg-pink-500 text-pink-100 dark:bg-pink-800 dark:text-pink-200',
    exercise: 'bg-teal-500 text-teal-100 dark:bg-teal-800 dark:text-teal-200',
    garden: 'bg-lime-500 text-lime-100 dark:bg-lime-800 dark:text-lime-200',
  };
  
  const icons = {
    furniture: faCouch,
    electronics: faTv,
    appliances: faBlender,
    boxes: faBox,
    musical: faMusic,
    fragile: faWineGlassAlt,
    exercise: faDumbbell,
    garden: faLeaf,
  };
  
  return { 
    icon: icons[validCategory as ItemCategory], 
    color: colors[validCategory as ItemCategory],
    tabColor: tabColor[validCategory as ItemCategory]
  };
};

function isValidCategory(category: string): category is ItemCategory {
  const validCategories: ItemCategory[] = [
    'furniture', 'electronics', 'appliances', 
    'musical', 'boxes', 'fragile', 'exercise', 'garden'
  ];
  return validCategories.includes(category as ItemCategory);
}