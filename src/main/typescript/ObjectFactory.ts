module deep.games.dropper {

    export class ObjectFactory {

        private static pool:any = {};

        static getObject ( id:string ) : createjs.Shape {
            return ObjectFactory.pool[id].clone();
        }

        static init () : void {

            // Create an instance of each object.
            // Resize it, wrap it in a container and cache the container.
            // Finally, draw the resized pixels from the cacheCanvas to a shape.
            // This removes any reference to the original image tag.
            // The purpose is to optimize for very large sized images that
            // may be uploaded by end users.
            for (var a in Constants.OBJECTS) {
                var o:IObject = Constants.OBJECTS[a];

                // Create the bitmap (if it exists)
                if (deep.Bridge.GameAssets.hasAsset(o.id)) {
                    // Enable the object since it's asset was found. If it's not found, it's left disabled and the object is not used in the game.
                    o.enabled = true;

                    var image:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset(o.id));

                    // Make the image as large as we're going to allow.
                    sdk.utils.CreateJSUtils.resizeToFit(image, Constants.GAME_OBJECT_SIZE, Constants.GAME_OBJECT_SIZE * 1.3);

                    // Get the transformed bounds for future measurements.
                    // This is the size we want our objects in memory.
                    var bounds:createjs.Rectangle = image.getTransformedBounds();

                    // Wrap the image in a container and cache it.
                    // This puts the RESIZED pixels on the cache canvas instead
                    // the unscaled pixels of the original.
                    var imageContainer:createjs.Container = new createjs.Container();
                    imageContainer.addChild(image);
                    imageContainer.cache(0, 0, bounds.width, bounds.height);

                    // Create a shape and draw the pixels from the containers
                    // cache canvas to it.
                    var instance:createjs.Shape = new createjs.Shape();
                    instance.graphics
                        .bf(<HTMLCanvasElement>imageContainer.cacheCanvas, "no-repeat")
                        .dr(0, 0, bounds.width, bounds.height)
                        .ef();
                    instance.setBounds(0, 0, bounds.width, bounds.height);
                    instance.cache(0, 0, bounds.width, bounds.height);

                    // Store the resized shape instance in the pool.
                    // We will clone these as needed.
                    ObjectFactory.pool[o.id] = instance;
                }
            }

        }

    }

}