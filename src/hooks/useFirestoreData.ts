import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  type WhereFilterOp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FirestoreCondition {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

/**
 * Firestore collection fetcher with optional filtering and ordering.
 * Serializes conditions/orderField to prevent infinite re-render loops.
 */
export function useFirestoreData<T extends { id: string }>(
  collectionName: string,
  conditions: FirestoreCondition[] = [],
  orderField?: string,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize conditions reference to prevent infinite effect loops
  const conditionsKey = useMemo(() => JSON.stringify(conditions), [conditions]);

  useEffect(() => {
    let isCancelled = false;

    const fetchFirestoreData = async () => {
      setLoading(true);
      setError(null);

      try {
        const collRef = collection(db, collectionName);
        const parsedConditions: FirestoreCondition[] = JSON.parse(conditionsKey);

        const constraints: QueryConstraint[] = parsedConditions.map((c) =>
          where(c.field, c.operator, c.value),
        );

        if (orderField) {
          constraints.push(orderBy(orderField, 'asc'));
        }

        const firestoreQuery =
          constraints.length > 0 ? query(collRef, ...constraints) : collRef;

        const snapshot = await getDocs(firestoreQuery);

        if (isCancelled) return;

        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(results);
      } catch (err) {
        if (isCancelled) return;

        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Firestore fetch error on ${collectionName}:`, err);
        setError(message);
        setData([]);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchFirestoreData();

    return () => {
      isCancelled = true;
    };
  }, [collectionName, conditionsKey, orderField]);

  return { data, loading, error };
}
