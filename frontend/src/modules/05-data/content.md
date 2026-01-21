# The Real World is Messy

In textbooks, lines always intersect perfectly at $(2, 3)$. In the real world, data is noisy. We rarely find a line that passes through *every* point.

Instead of solving $Ax=b$ exactly (which is impossible), we solving it *approximately*. We want the line that misses the points by the **Least** amount.

# The Geometry of Least Squares

We are trying to project the vector $b$ (our data) onto the "Column Space" of matrix $A$ (our model). The shadow of $b$ onto this space is the best possible prediction.

This leads to the famous "Normal Equation":

$$ A^T A \hat{x} = A^T b $$

# Check Your Understanding

Why can't we just pick any line?
